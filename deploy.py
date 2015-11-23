import os

import boto.s3
from boto.s3.key import Key

def upload(bucket, filename):
    key = Key(bucket)
    key.key = filename
    key.set_contents_from_filename(filename)

os.system('webpack -pi --optimize-dedupe')

conn = boto.s3.connect_to_region('ap-northeast-1')
buckets = conn.get_all_buckets()
print 'Select bucket to deploy'
for i, bucket in enumerate(buckets):
    print '\t{}. {}'.format(i+1, bucket.name)

num = int(raw_input('> '))
bucket = buckets[num - 1]

upload(bucket, 'index.html')
upload(bucket, 'dist/app.js')
upload(bucket, 'dist/vendor.bundle.js')
