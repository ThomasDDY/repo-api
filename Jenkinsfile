pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Test Podman') {
            steps {
                bat 'podman info'
            }
        }

        stage('Start Podman VM') {
            steps {
                bat '''
                    FOR /F "tokens=*" %%i IN ('podman machine list --format "{{.Running}}"') DO SET RUNNING=%%i

                    echo Podman running state: %RUNNING%

                    IF "%RUNNING%"=="true" (
                        echo Podman VM already running. Skipping start...
                    ) ELSE (
                        echo Starting Podman VM...
                        podman machine start
                    )
                '''
            }
        }

        stage('Install Dependencies') {
            steps { bat 'npm install' }
        }

        stage('Run Tests') {
            steps {
                bat 'npm test'
            }
        }

        stage('Build Container Image') {
            steps { 
                bat """
                    podman build -t repo-api:${env.BUILD_NUMBER} .
                    podman tag repo-api:${env.BUILD_NUMBER} repo-api:latest
                """ 
            }
        }

        stage('Deploy') {
            steps {
                bat 'podman play kube deployment.yaml'
            }
        }

        stage('Health Check') {
            steps {
                bat 'curl http://localhost:3000/health'
            }
        }

        stage('Cleanup') {
            steps {
                bat '''
                    podman container prune -f
                    podman image prune -f
                '''
            }
        }

    }
}

