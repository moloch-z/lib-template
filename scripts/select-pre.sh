#!/usr/bin/env sh

PS3='Please enter your choice: '
options=("alpha" "beta" "rc" "Quit")
pre=''
select opt in "${options[@]}"
do
    case $opt in
        "alpha")
            echo "you chose alpha"
            pre='alpha'
            pnpm changeset pre enter alpha
            break
            ;;
        "beta")
            echo "you chose beta"
            pre='beta'
            pnpm changeset pre enter beta
            break
            ;;
        "rc")
            echo "you chose rc"
            pre='rc'
            pnpm changeset pre enter rc
            break
            ;;
        "Quit")
            pnpm changeset pre exit
            break
            ;;
        *) echo invalid option;;
    esac
done

# 打包
pnpm build
# 提交变更集
pnpm changeset 
# 选择版本
pnpm version-packages
# 发包
pnpm release

if $pre != '' ; then
  pnpm changeset pre exit
fi

echo "✅ Publish completed"