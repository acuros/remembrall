# Remembrall
Remembrall is vocabulary studying service for serverless architecture example with AWS. Made with React + Reflux + AWS JS SDK(STS using facebook authentication + DynamoDB) and deployed on S3.

If you want to deploy this service on your AWS, follow the steps below.

1. Clone this repository on your local machine and install all requirements(nodejs, webpack ...)
2. Make your facebook app in https://developers.facebook.com
3. In AWS IAM, create new role. You have to choice Identity Provider Access -> Grant access to web identity providers for role type.
4. Choose Identity Provider as Facebook and fill the application id field with App ID you made in STEP 2.
5. After you create role, you have to add policy. I prefer Inline policy for it. The example is at the bottom of this page.
6. Set your APP ID and Role ARN in webpack.config.js
7. Webpack the repository
8. Setup your s3. http://docs.aws.amazon.com/AmazonS3/latest/dev/website-hosting-custom-domain-walkthrough.html
9. Upload index.html and dist directory on your s3.


###Reading materials
* http://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRoleWithWebIdentity.html
* http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_oidc_user-id.html
* http://docs.aws.amazon.com/AmazonS3/latest/dev/website-hosting-custom-domain-walkthrough.html


###Example policy for the role
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:DeleteItem",
                "dynamodb:PutItem",
                "dynamodb:Query"
            ],
            "Resource": [
                "arn:aws:dynamodb:ap-northeast-1:617665285615:table/Word"
            ],
            "Condition": {
                "ForAllValues:StringEquals": {
                    "dynamodb:LeadingKeys": [
                        "${graph.facebook.com:id}"
                    ]
                }
            }
        }
    ]
}
```
