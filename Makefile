.PHONY: bootstrap build test verify demo
bootstrap:
	pnpm install --frozen-lockfile
build:
	pnpm build
test:
	pnpm test
verify:
	pnpm verify
demo:
	pnpm demo
