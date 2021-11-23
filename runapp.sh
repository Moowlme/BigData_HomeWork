docker build -t e4glet/mynode .
docker stop myapp
docker rm myapp
docker run -dit -p 3000:3000 --name myapp e4glet/mynode