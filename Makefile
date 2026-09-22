.PHONY: bootstrap build test verify demo
bootstrap:
	pnpm install --frozen-lockfile
	pnpm hooks:install
build:
	pnpm build
test:
	pnpm test
verify:
	pnpm verify
demo:
	pnpm demo
