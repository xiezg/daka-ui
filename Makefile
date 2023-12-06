all: daka-ui

.PHONY: mermaid
.PHONY: daka-ui
.PHONY: clean

clean:
	npm cache clean --force
	rm -rf ./node_modules

daka-ui: mermaid
	npm link mermaid
	npm run build

mermaid: clean
	make -C ./lib/mermaid
