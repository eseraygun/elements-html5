npm install
node_modules/.bin/gulp build
docker build ./ --tag gcr.io/eseraygun-com/elements
docker push gcr.io/eseraygun-com/elements
gcloud run deploy elements --image=gcr.io/eseraygun-com/elements \
    --project=eseraygun-com \
    --platform=managed \
    --allow-unauthenticated \
    --region=us-east1 \
    --port=80 \
    --cpu=1 \
    --memory=128Mi \
    --concurrency=80 \
    --timeout=300s \
    --max-instances=1
