# task-api-mobile
React native mobile app for taskwarrior api

To build: docker build -t sportnak/taskrunner . --build-arg CACHEBUST=$(date +%s)
To push: docker push sportnak/taskrunner
To run: docker rm taskrunner && docker run --name taskrunner -d -p 3001:3000 sportnak/taskrunner
To build apk: https://facebook.github.io/react-native/docs/signed-apk-android.html