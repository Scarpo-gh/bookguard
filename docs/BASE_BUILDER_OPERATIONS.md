# Base Builder Operasyon Akışı

Bu repo, Arc hackathon reposundan ayrıdır. Amaç gerçek bir Base builder izi bırakmak ve Guild doğrulamalarını çalışan ürün kanıtıyla tamamlamaktır.

## Şu an tamamlandı

- [x] Ayrı local Git repository: `~/outcomerail-base`
- [x] `ReceiptAnchorV1` contractı
- [x] Test-first contract testleri
- [x] Foundry doğrulama komutu: `scripts/check.sh`
- [x] Foundry v1.7.1 checksum doğrulanarak local kuruldu

## Onur: hesap / imza gereken adımlar

Bu adımlar parola, OAuth veya wallet imzası içerdiği için kullanıcı tarafından yapılır.

1. GitHub’da `Scarpo-gh/outcomerail-base` adlı **public** repo oluştur. README ekleme; local repo hazır.
2. Repo URL’sini paylaş. Şakir `origin` ekleyip ilk local commitleri pushlar.
3. Guild’de wallet, GitHub ve X hesaplarını bağla; Guild’e katıl.
4. Bağlanan X hesabından `@BuildOnBase` takip et.
5. Base Sepolia için faucet ETH al; private key/seed phrase paylaşma.

## Şakir: repo URL’sinden sonra

1. Local `main` branch’i yeni public remote’a pushlar.
2. Public GitHub commit ve repo görünürlüğünü doğrular.
3. Base Sepolia deploy command’ini önce broadcast olmadan dry-run çalıştırır.
4. Dry-run çıktısını paylaşır; yalnız Onur onayından sonra deploy broadcast edilir.
5. Tx hash ve contract address ile Sepolia Basescan doğrulaması yapar.
6. Guild Verify ekranında testnet deployunun sayılıp sayılmadığını kontrol eder.

## Base Dashboard / dağıtım

- İlk web arayüzü yayımlanmadan Base Dashboard app metadata tamamlanmaz.
- Web app: standart mobil web app, wagmi/viem/Base Account.
- Farcaster manifesti Base App için gerekli değildir.
- Builder Code, uygulamanın gerçek transaction üretmeye başlamasından sonra eklenir.
- Office Hours, canlı demo ve tek teknik sorudan sonra kullanılır.

## Güvenlik sınırı

- Mainnet, user funds, custody, trading, order routing, token çıkarımı veya reward farming contract’ı yoktur.
- x402 ve Base Verify Onchain, ancak gerçek ücretli API veya anti-Sybil claim ihtiyacı ortaya çıkarsa sonraki faza girer.
