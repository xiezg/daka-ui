all:daka

.PHONY: daka-ui

daka-ui: 
	npm run build

push: daka-ui
	scp -r build/* root@heapfree.com://var/www/html

.PHONY : clean
clean:
	rm -f ./daka


