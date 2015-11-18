import json
import os
import sys

import boto
import boto.dynamodb2
from boto.dynamodb2.table import Table, HashKey, RangeKey


SETUP_HOME = os.path.dirname(os.path.abspath(__file__))


def main():
    region = choose_dynamodb_region()
    create_table(region)

    fb_app_id = raw_input('Facebook app id > ')
    policies = create_policies(region, fb_app_id)
    role_arn = create_role(*policies)
    set_webpack_constant(fb_app_id, role_arn)
    print 'Finish'


def choose_dynamodb_region():
    region = raw_input('Region name > ')
    regions = sorted([r.name for r in boto.dynamodb2.regions()])
    if region not in regions:
        print 'Region name must be one of \n\t{}'.format('\n\t'.join(regions))
        sys.exit(1)
    return region


def create_table(region):
    connection = boto.dynamodb2.connect_to_region(region)
    Table.create(
        'Word',
        schema=[
            HashKey('user'),
            RangeKey('word')
        ],
        throughput={
            'read': 1,
            'write': 1
        },
        connection=connection
    )


def create_policies(region, fb_app_id):
    with open(os.path.join(SETUP_HOME, 'trust_policy.json')) as f:
        trust_policy = json.load(f)
    trust_policy['Statement'][0]['Condition']['StringEquals']\
            ['graph.facebook.com:app_id'] = fb_app_id

    account_id = boto.connect_iam().get_user().arn.split(':')[4]
    with open(os.path.join(SETUP_HOME, 'permission_policy.json')) as f:
        permission_policy = json.load(f)

    permission_policy['Statement'][0]['Resource'] = [
            u'arn:aws:dynamodb:{}:{}:table/Word'.format(region, account_id)]


    return trust_policy, permission_policy


def create_role(trust_policy, permission_policy):
    DEFAULT_ROLE_NAME = 'RemembrallFacebookSTS'
    role_name = raw_input('Role name [{}] > '.format(DEFAULT_ROLE_NAME)) or \
            DEFAULT_ROLE_NAME

    iam = boto.connect_iam()
    print 'Creating role...'
    response = iam.create_role(role_name, trust_policy)
    arn = response['create_role_response']['create_role_result']['role']['arn']
    print 'Attaching policy...'
    iam.put_role_policy(role_name, 'DynamoDB', json.dumps(permission_policy))
    return arn


def set_webpack_constant(fb_app_id, role_arn):
    project_home = SETUP_HOME.split(os.sep)[:-1]
    path = os.sep.join(project_home + ['webpack.config.js'])
    with open(path) as f:
        data = f.read()
    data = data.replace('__FB_APP_ID__', fb_app_id)
    data = data.replace('__ROLE_ARN__', role_arn)
    with open(path, 'w') as f:
        f.write(data)


if __name__ == '__main__':
    main()
