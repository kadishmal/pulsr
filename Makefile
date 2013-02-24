REPORTER = dot

test:
	@NODE_ENV=test ./node_modules/.bin/mocha tests \
	--reporter $(REPORTER)

pdocs:
	./node_modules/.bin/docco \
	pulsr/* pulsr/fileHandlers/* \
	controllers/* \
	pagelets/content/* pagelets/content/layouts/* pagelets/navigation/* pagelets/ga/*
