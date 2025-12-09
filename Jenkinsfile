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

        stage('Build Container Image') {
            steps { bat 'podman build -t repo-api .' }
        }

        stage('Run Container') {
            steps {
                bat '''
                    podman rm -f repo-api || exit 0
                    podman run -d -p 3000:3000 --name repo-api repo-api
                '''
            }
        }
    }
}

