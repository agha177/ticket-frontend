pipeline {
    agent any

    environment {
        IMAGE_NAME = "ticket-frontend"
	ECR_REGISTRY = "861097501014.dkr.ecr.us-east-1.amazonaws.com"
        ECR_REPO = "ticket-frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} -t ${IMAGE_NAME}:latest ."
            }
        }
	
	stage('Push to ECR'){
	    steps {
		sh "aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${ECR_REGISTRY}"
                sh "docker tag ${IMAGE_NAME}:${BUILD_NUMBER} ${ECR_REGISTRY}/${ECR_REPO}:${BUILD_NUMBER}"
                sh "docker tag ${IMAGE_NAME}:${BUILD_NUMBER} ${ECR_REGISTRY}/${ECR_REPO}:latest"
                sh "docker push ${ECR_REGISTRY}/${ECR_REPO}:${BUILD_NUMBER}"
                sh "docker push ${ECR_REGISTRY}/${ECR_REPO}:latest"
	    }
	}

        stage('Deploy') {
            steps {
                sh "docker stop frontend || true"
                sh "docker rm frontend || true"
                sh """
                    docker run -d --name frontend \
                    --network ticket-infra_default \
                    -p 80:80 \
                    ${IMAGE_NAME}:${BUILD_NUMBER}
                """
            }
        }
    }

    post {
        success {
            echo "frontend pipeline completed successfully."
        }
        failure {
            echo "frontend pipeline failed."
        }
    }
}
