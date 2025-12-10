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
                    FOR /F "tokens=*" %%i IN ('podman machine list --format "{{.Name}} {{.Running}}"') DO SET INFO=%%i

                    echo Podman info: %INFO%

                    IF "%INFO%"=="" (
                        echo No Podman VM found. Creating...
                        podman machine init
                        podman machine start
                    ) ELSE (
                        FOR /F "tokens=2" %%i IN ("%INFO%") DO SET RUNNING=%%i

                        echo Podman running state: %RUNNING%

                        IF "%RUNNING%" (
                            echo Podman VM is already running. Skipping start...
                        ) ELSE (
                            echo Starting Podman VM...
                            podman machine start
                        )
                    )
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
