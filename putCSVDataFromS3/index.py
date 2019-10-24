import boto3

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('example')


def lambda_handler(event, context):
    name = event['Records'][0]['s3']['bucket']['name']
    print(name)
    key = event['Records'][0]['s3']['object']['key']
    print(key)
    obj = s3.get_object(Bucket=name, Key=key)

    rows = obj['Body'].read().decode('utf-8').split('\n')

    for row in rows:
        print(row)
        
        try:
            table.put_item(
                Item = {
                    "firstname": row.split(',')[0],
                    "lastname": row.split(',')[1],
                    "address": row.split(',')[2],
                    "county": row.split(',')[3],
                    "state": row.split(',')[4],
                    "zip": row.split(',')[5]
                })
        except Exception as e:
            print(e)
                