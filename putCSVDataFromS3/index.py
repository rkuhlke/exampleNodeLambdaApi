import boto3

s3_client = boto3.client('s3')


def lambda_handler(event, context):
    bucket_name = event['Records'][0]['s3']['bucket']['name']
    s3_filename = event['Records'][0]['s3']['object']['key']
    resp = s3_client.get_object(Bucket=bucket_name, Key=s3_filename)
    data = resp['Body'].read().decode('utf-8')
    employees = data.split('\\n')
    for emp in employees:
        print(employees)
        # adding to dynamodb
