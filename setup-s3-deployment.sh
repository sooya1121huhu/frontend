#!/bin/bash

# S3 배포 설정 스크립트
# 사용법: ./setup-s3-deployment.sh <BUCKET_NAME> <REGION>

BUCKET_NAME=$1
REGION=${2:-us-east-1}

if [ -z "$BUCKET_NAME" ]; then
    echo "사용법: $0 <BUCKET_NAME> [REGION]"
    exit 1
fi

echo "S3 버킷 '$BUCKET_NAME'을(를) 생성하고 설정합니다..."

# S3 버킷 생성
aws s3 mb s3://$BUCKET_NAME --region $REGION

# 정적 웹사이트 호스팅 활성화
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# 버킷 정책 설정
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json

# CORS 설정
cat > cors-config.json << EOF
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": []
    }
  ]
}
EOF

aws s3api put-bucket-cors --bucket $BUCKET_NAME --cors-configuration file://cors-config.json

# 버킷 버전 관리 비활성화 (선택사항)
aws s3api put-bucket-versioning --bucket $BUCKET_NAME --versioning-configuration Status=Suspended

echo "S3 버킷 설정이 완료되었습니다!"
echo "버킷 이름: $BUCKET_NAME"
echo "지역: $REGION"
echo "웹사이트 URL: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"

# 정리
rm -f bucket-policy.json cors-config.json

echo ""
echo "다음 단계:"
echo "1. GitHub Secrets에 다음 값들을 설정하세요:"
echo "   - AWS_ACCESS_KEY_ID"
echo "   - AWS_SECRET_ACCESS_KEY"
echo "   - AWS_REGION: $REGION"
echo "   - S3_BUCKET_NAME: $BUCKET_NAME"
echo "2. CloudFront 배포를 원한다면 CloudFront 배포를 생성하세요." 