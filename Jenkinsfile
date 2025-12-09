pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build Container Image') {
            steps {
                bat 'podman build -t repo-api .'
            }
        }

        stage('Run Container') {
            steps {
                bat '''
                    podman rm -f repo-api
                    podman run -d -p 3000:3000 --name repo-api repo-api
                '''
            }
        }
    }
}
