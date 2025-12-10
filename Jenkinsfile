pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        APP_NAME = "repo-api"
        HOST_PORT = "3001"
        CONTAINER_PORT = "3000"
    }

    stages {

        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Start Podman VM') {
            steps {
                bat '''
                    podman machine inspect podman-machine-default >nul 2>&1
                    if %errorlevel% neq 0 (
                        echo Creating Podman VM...
                        podman machine init
                    ) else (
                        echo Podman VM already exists.
                    )

                    echo Starting Podman VM...
                    podman machine start 2>nul || echo VM already running.
                '''
            }
        }

        stage('Install Dependencies') {
            steps { bat 'npm install' }
        }

        stage('Build Container Image') {
            steps { bat 'podman build -t %APP_NAME% .' }
        }

        stage('Clean Previous Deployment') {
            steps {
                bat '''
                    echo Removing old pod if exists...
                    podman pod rm -f repo-api-pod 2>nul || echo No existing pod.

                    echo Removing old container(s)...
                    podman rm -f %APP_NAME% 2>nul || echo No existing container.
                '''
            }
        }

        stage('Deploy with Kube YAML') {
            steps {
                bat '''
                    echo Deploying with Podman Kube...
                    podman play kube deployment.yaml

                    echo Current Podman Pods:
                    podman pod ps

                    echo Current Podman Containers:
                    podman ps
                '''
            }
        }
    }

    post {
        success {
            echo "Deployment OK — Application is live at http://localhost:3001"
        }
        failure {
            echo "Deployment FAILED — check Podman logs"
        }
    }
}
