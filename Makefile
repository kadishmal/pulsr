REPORTER = dot

test:
	@NODE_ENV=test ./node_modules/.bin/mocha tests \
	--reporter $(REPORTER)
