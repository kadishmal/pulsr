REPORTER = dot

test:
	@NODE_ENV=test ./node_modules/.bin/mocha tests \
	--reporter $(REPORTER)

bdocs:
	./node_modules/.bin/docco pulsr/* \
	pulsr/fileHandlers/* controllers/* pagelets/ga/* \
	pagelets/content/* pagelets/content/layouts/*
