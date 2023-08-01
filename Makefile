install: 
	npm ci
publish: 
	npm publish --dry-run
lint:
	npx eslint .
link:
	sudo npm link
# test:
# 	npm test
# test-coverage:
# 	npm test -- --coverage --coverageProvider=v8
fix:
	npx eslint . --fix
