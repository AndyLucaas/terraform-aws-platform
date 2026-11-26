kubectl run test-hpa -n production \
  --image=fortio/fortio --restart=Never -- \
  load -qps 3000 -c 64 -t 0 \
  http://itticket-backend-svc:8080/actuator/health
