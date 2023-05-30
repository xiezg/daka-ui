all:daka

.PHONY: daka-ui

daka-ui: 
	npm run build

push: daka-ui
	#scp -r build/* root@heapfree.com://var/www/html
	scp -r build/* root@111.67.196.119:/var/www/html

.PHONY : clean
clean:
	rm -f ./daka


