.ONESHELL:

all: help

################################################################################
# PROJECT CONFIG
PROJECT_NAME := magic-circle
CONTAINER_NAME := frontend
IMAGE_REGISTRY := registry.cojodi.com
IMAGE_NAME := $(PROJECT_NAME)/$(CONTAINER_NAME)
RELEASE_DATE := $(shell date -u +'%Y-%m-%dT%H:%M:%SZ')
RELEASE_DATE_TAG := $(shell date -u +'%Y-%m-%dT%H-%M-%SZ')

################################################################################
# DOCKER
docker: docker-build docker-push ## build and push the docker image, extra args with DOCKER_ARGS=... (e.g. --no-cache)

docker-push:
	docker image push $(IMAGE_REGISTRY)/$(IMAGE_NAME):latest \
		&& docker image push $(IMAGE_REGISTRY)/$(IMAGE_NAME):$(RELEASE_DATE_TAG)

docker-build: ## build the docker image, extra args with DOCKER_ARGS=... (e.g. --no-cache)
	DOCKER_BUILDKIT=1 docker buildx build \
		$${DOCKER_ARGS} \
		--ssh default \
		--network host \
		--build-arg BUILD_DATE=$(RELEASE_DATE) \
		--build-arg VCS_REF=$(RELEASE_VERSION) \
		-t $(IMAGE_NAME):$(RELEASE_DATE_TAG) \
		-t $(IMAGE_NAME):latest \
		-t $(IMAGE_REGISTRY)/$(IMAGE_NAME):$(RELEASE_DATE_TAG) \
		-t $(IMAGE_REGISTRY)/$(IMAGE_NAME):latest \
		.

################################################################################
# RUN & BUILD
dev: ## Start development server
	npm run dev

build: ## Create production build
	tsc && npx vite build

################################################################################
# HELP
help: ## print help
	@grep '##' $(MAKEFILE_LIST) \
		| grep -Ev 'grep|###' \
		| sed -e 's/^\([^:]*\):[^#]*##\([^#]*\)$$/\1:\2/' \
		| awk -F ":" '{ printf "%-18s%s\n", $$1 ":", $$2 }' \
		| grep -v 'sed'
