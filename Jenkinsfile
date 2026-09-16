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
                  sh "kubectl set image deployment/frontend frontend=${ECR_REGISTRY}/${ECR_REPO}:${BUILD_NUMBER} --record"
         	  sh "kubectl rollout status deployment/frontend --timeout=120s"
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
