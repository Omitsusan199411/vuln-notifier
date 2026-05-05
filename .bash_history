ls
cd /root
pnpm list -w
pnpm add -Dw @biomejs/biome lefthook
pnpm list -w
pnpm exec biome init
lefthook install
ls
exit
