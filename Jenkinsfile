pipeline {
    agent any

    environment {
        IMAGE_NAME = "ticket-frontend"
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
