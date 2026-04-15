# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.1.0](https://github.com/excflor/velvethyper/compare/v1.0.0...v1.1.0) (2026-04-15)


### Features

* **core:** specialized hardware identity database expanded to 20 pro gaming profiles (Desktop, Laptop, Workstation) ([b0d72dc](https://github.com/excflor/velvethyper/commit/b0d72dc2ae5a0d679ecf6a8fdd37cb212aafc574))
* **core:** transitioned to dynamic, data-driven hardware profile orchestration with mixed Enthusiast/OEM database ([fd23a8b](https://github.com/excflor/velvethyper/commit/fd23a8b0792ebdf860ceb508629d26f61ed668d3))
* **ui:** implemented auto-stealth detection to instantly verify hardening status upon VMX selection ([1e7f73f](https://github.com/excflor/velvethyper/commit/1e7f73f448473ec0085e5e9e77b76a926dbcd397))
* **ui:** integrated dynamic app version display into the dashboard header from the single source of truth (package.json) ([7bccbaa](https://github.com/excflor/velvethyper/commit/7bccbaaddf9cb861fd98a3030abff4676f55391c))
* **ui:** synchronized deep hardening activity logs between Python engine and Command Center dashboard ([80d08ec](https://github.com/excflor/velvethyper/commit/80d08ecca9e8c3ee2b13ed5bc88f62c0154f1e23))


### Bug Fixes

* **core:** added Python entry point to vmx_hardener for automated dashboard execution ([66bd835](https://github.com/excflor/velvethyper/commit/66bd835221991f54d54f01386a82516286f8b349))
* **core:** injected dynamic PYTHONPATH and set CWD for Python execution in production context to resolve module resolution errors ([adaa1b3](https://github.com/excflor/velvethyper/commit/adaa1b303b6c045bb7fcf879f834442b4e86f2ba))
* **ui:** added global icon property to ensure portable executable branding consistency ([2ba8b75](https://github.com/excflor/velvethyper/commit/2ba8b7511d77bd0e249b5abaa55ddeaf048d0053))
* **ui:** explicitly set win.icon path in builder config to resolve default icon fallback in portable build ([8168766](https://github.com/excflor/velvethyper/commit/8168766171b60b80fdecb2de5a4afac43993d48e))

## 1.0.0 (2026-04-15)


### Features

* **core:** finalized Phase 5 with RDTSC timing evasion and Ghost Launcher stealth suite ([7cba8ff](https://github.com/excflor/velvethyper/commit/7cba8ff4be27244a6cf238d187e90dad49bad887))
* **core:** implemented actual production build logic in IPC handler to compile and package guest tools ([1bd21bb](https://github.com/excflor/velvethyper/commit/1bd21bb11e43af08c8f4d77de61df89b3fdddac2))
* **core:** transitioned dashboard from mocks to full orchestration for hardening and tool packaging ([68bdb60](https://github.com/excflor/velvethyper/commit/68bdb60e41b04a36703b50a8bab9cdcd882b7d25))
* **ui:** added native VMX file picker and integrated target selection in dashboard ([6c4d038](https://github.com/excflor/velvethyper/commit/6c4d03849cf00629b6935021cb900bf6a85acf37))
* **ui:** consolidated application into a single-view Command Center and removed unused placeholders ([3f2afcb](https://github.com/excflor/velvethyper/commit/3f2afcb8d4d36e7f4031d14f52b11d8d1568800d))
* **ui:** implemented dynamic rotation mock, sticky header blur, and full tab content ([1ea7f18](https://github.com/excflor/velvethyper/commit/1ea7f18df910a6c25ff66134db60995f1c3a587c))
* **ui:** implemented premium VelvetHyper desktop dashboard with bento grid and watchdog mode ([6bb6fe0](https://github.com/excflor/velvethyper/commit/6bb6fe02c9ac4a31401c613db3afabcc6321a059))
* **ui:** implemented seamless titlebar and final dashboard layout refinements ([681895e](https://github.com/excflor/velvethyper/commit/681895ec76e4dd6909e8b8ae7ff37b45594f2581))
* **ui:** integrated status into sticky header and differentiated dashboard viz from management tabs ([ae6ee19](https://github.com/excflor/velvethyper/commit/ae6ee19b5f63613fa29099a8fb7ae2878f92823f))


### Bug Fixes

* **core:** resolved JSX namespace errors and cleaned up unused imports ([e672673](https://github.com/excflor/velvethyper/commit/e67267306ceb7445ceb1cbbbd9d0218e81926a47))
* **core:** synchronized hardening API signatures between renderer, preload, and main processes ([dfaa51f](https://github.com/excflor/velvethyper/commit/dfaa51f030ae28a40092193efc49302b7ff19ff0))
* **native:** resolved C++ string constructor compilation error in launcher.cpp ([7a32818](https://github.com/excflor/velvethyper/commit/7a3281856af3af656fa9c0b2fd7973d49ad94602))
* **ui:** implemented dynamic hardware profile state and rotation updates ([89a3742](https://github.com/excflor/velvethyper/commit/89a374265a93131299e66d60e92d2426c78e2195))
* **ui:** synced Electron main process with new icon.ico asset ([ee7d9c8](https://github.com/excflor/velvethyper/commit/ee7d9c8dc2d56364fbfae2bf675da50092b632eb))
