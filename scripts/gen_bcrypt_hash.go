// 在仓库根目录执行：cd backend && go run ../scripts/gen_bcrypt_hash.go '<明文密码>'
// 依赖 backend 模块内的 golang.org/x/crypto/bcrypt。
package main

import (
	"fmt"
	"os"

	"golang.org/x/crypto/bcrypt"
)

func main() {
	p := "TestUser88!"
	if len(os.Args) > 1 {
		p = os.Args[1]
	}
	h, err := bcrypt.GenerateFromPassword([]byte(p), bcrypt.DefaultCost)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	fmt.Print(string(h))
}
