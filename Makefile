PORT ?= 5173

.PHONY: dev
dev:
	npm run dev -- --port $(PORT)

.PHONY: build
build:
	npm run build

.PHONY: preview
preview:
	npm run preview -- --port $(PORT)

.PHONY: install
install:
	npm install
