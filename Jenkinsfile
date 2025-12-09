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
                sh 'npm install'
            }
        }

        stage('Build Container Image') {
            steps {
                sh 'podman build -t repo-api .'
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                    podman rm -f repo-api || true
                    podman run -d -p 3000:3000 --name repo-api repo-api
                '''
            }
        }
    }
}
