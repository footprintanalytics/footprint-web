NAME = foot-print-frontend
REGISTRY = registry-intl.us-east-1.aliyuncs.com/mexl
TAG = master 

build:
	echo building ${NAME}:${TAG}
	cd /opt/jenkins_work_home/workspace/foot-print-frontend/bin && bash build-docker.sh
	docker build -t ${PROD_REGISTRY}/${NAME}:${TAG} .
    cd bin/docker && docker build -t ${REGISTRY}/${NAME}:${TAG} .
	docker push ${REGISTRY}/${NAME}:${TAG}