# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: email-subscribe.spec.ts >> EmailSubscribeForm - exit intent modal >> email form is present in exit intent modal
- Location: tests/e2e/email-subscribe.spec.ts:79:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[role="dialog"]')
Expected: visible
Error: strict mode violation: locator('[role="dialog"]') resolved to 2 elements:
    1) <div role="dialog" tabindex="-1" aria-modal="true" aria-labelledby="_r_0_" class="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">…</div> aka getByRole('dialog', { name: 'Hey, wait!' })
    2) <div role="dialog" aria-modal="true" aria-labelledby="cookie-consent-title" class="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">…</div> aka getByRole('dialog', { name: 'This site uses cookies' })

Call log:
  - Expect "toBeVisible" with timeout 2000ms
  - waiting for locator('[role="dialog"]')

```

# Page snapshot

```yaml
- generic [ref=e1]:
    - banner [ref=e2]:
        - generic [ref=e4]:
            - navigation "Main navigation" [ref=e5]:
                - link "Home" [ref=e6]:
                    - /url: "#home"
                - link "Projects" [ref=e7]:
                    - /url: "#projects"
                - link "Experience" [ref=e8]:
                    - /url: "#experience"
                - link "Skills" [ref=e9]:
                    - /url: "#skills"
                - link "Contact" [ref=e10]:
                    - /url: "#contact"
                - link "Used in this site" [ref=e11]:
                    - /url: /en/tech-stack/
            - generic [ref=e12]:
                - link "Linktree profile" [ref=e13]:
                    - /url: https://linktr.ee/rogeriodocarmo
                    - img [ref=e14]
                    - generic [ref=e16]: Linktree
                - generic [ref=e17]:
                    - generic [ref=e18]: Select language
                    - generic [ref=e19]: 🇺🇸
                    - combobox "Select language" [ref=e20] [cursor=pointer]:
                        - option "🇧🇷 Português (BR)"
                        - option "🇺🇸 English" [selected]
                        - option "🇪🇸 Español"
                    - generic: ▾
                - button "Switch to dark mode" [ref=e21] [cursor=pointer]:
                    - img "Moon" [ref=e22]: 🌙
    - main [ref=e23]:
        - region "Hero section" [ref=e25]:
            - generic [ref=e26]:
                - generic [ref=e27]:
                    - paragraph [ref=e28]: Hello, I'm
                    - heading "Rogério do Carmo" [level=1] [ref=e29]
                    - paragraph [ref=e30]: Frontend Mobile React Native Developer
                    - generic [ref=e31]:
                        - img "UNESP Logo" [ref=e32]
                        - generic [ref=e33]:
                            - paragraph [ref=e34]: Bachelor in Computer Science
                            - paragraph [ref=e35]: Master in Cartographic Sciences
                            - paragraph [ref=e36]: UNESP
                    - generic [ref=e37]:
                        - paragraph [ref=e38]: Complete master's dissertation
                        - link "Evaluation of GNSS measurement quality and positioning in Android smartphones" [ref=e40]:
                            - /url: http://hdl.handle.net/11449/243430
                            - img [ref=e41]
                            - text: Evaluation of GNSS measurement quality and positioning in Android smartphones
                        - link "Download master's dissertation in PDF" [ref=e46]:
                            - /url: /academic/masters_degree_dissertation_rogerio_do_carmo.pdf
                            - img [ref=e47]
                            - generic [ref=e49]: Download Dissertation (PDF)
                    - generic [ref=e50]:
                        - img "Company Logo" [ref=e51]
                        - generic [ref=e52]:
                            - paragraph [ref=e53]: Senior Mobile Developer
                            - paragraph [ref=e54]: Current
                    - generic [ref=e55]:
                        - link "View My Work" [ref=e56]:
                            - /url: "#projects"
                        - link "Get in Touch" [ref=e57]:
                            - /url: mailto:contact@rogeriodocarmo.com
                            - img [ref=e58]
                            - text: Get in Touch
                    - paragraph [ref=e61]:
                        - link "contact@rogeriodocarmo.com" [ref=e62]:
                            - /url: mailto:contact@rogeriodocarmo.com
                - img "Rogério do Carmo — Mobile React Native Developer" [ref=e65]
        - tablist "Choose a Path" [ref=e68]:
            - generic [ref=e69]:
                - tab "Professional" [selected] [ref=e70] [cursor=pointer]:
                    - img [ref=e71]
                    - text: Professional
                - tab "Academic" [ref=e73] [cursor=pointer]:
                    - img [ref=e74]
                    - text: Academic
        - region "Professional Experience experience" [ref=e79]:
            - generic [ref=e80]:
                - heading "Professional Experience" [level=2] [ref=e81]
                - generic [ref=e82]:
                    - article [ref=e83]:
                        - generic [ref=e84]:
                            - generic [ref=e85]:
                                - heading "Desenvolvedor Mobile React Native" [level=3] [ref=e86]
                                - paragraph [ref=e87]: Topaz · Remoto, Brasil
                                - paragraph [ref=e88]: Feb 2023 – Present · 3 yrs 3 mo
                            - button "Expand details" [ref=e89] [cursor=pointer]:
                                - img [ref=e90]
                        - paragraph [ref=e92]: "Atuação no produto interno da empresa, voltado ao setor bancário. Desenvolvimento e manutenção de aplicativos móveis para instituições financeiras, com foco em funcionalidades críticas e experiência do usuário. ### Conquistas - Desenvolveu e implementou módulo Pix completo para aplicativos bancários, incluindo integração com DICT (Diretório de Identificadores de Contas Transacionais) - Implementou Login Biométrico com integração Daon para autenticação segura - Criou módulo de Empréstimo com fluxo completo de solicitação e aprovação - Prestou manutenção e correção de bugs em aplicativos bancários críticos - Atuou em projetos para clientes específicos: CrediSIS (Brasil), Bradescard (México), Banco Macro (Argentina) e Banco do Nordeste - BNB (Brasil) - Trabalhou com Google Play Console, Apple Developer e TestFlight para distribuição de apps - Implementou testes unitários com Jest para garantir qualidade do código - Utilizou ferramentas de monitoramento (Elastic, Kibana, Grafana) para análise de performance - Experiência com metodologias ágeis e comunicação eficiente com stakeholders (POs, BAs, QAs, SMs) - Orientação de desenvolvedores júnior em boas práticas de desenvolvimento React Native"
                    - article [ref=e93]:
                        - generic [ref=e94]:
                            - generic [ref=e95]:
                                - heading "Desenvolvedor Flutter" [level=3] [ref=e96]
                                - paragraph [ref=e97]: Rubcube · Remoto, Brasil
                                - paragraph [ref=e98]: Oct 2021 – Jan 2022 · 3 mo
                            - button "Expand details" [ref=e99] [cursor=pointer]:
                                - img [ref=e100]
                        - paragraph [ref=e102]: "Atuação no aplicativo móvel do cliente Virtus Pay, focando em manutenção e qualidade do código. ### Conquistas - Efetuou manutenção e correções de bugs no aplicativo Virtus Pay - Trabalhou com Flutter para desenvolvimento multiplataforma - Experiência com aplicativos de pagamento digital"
                    - article [ref=e103]:
                        - generic [ref=e104]:
                            - generic [ref=e105]:
                                - heading "Desenvolvedor Mobile React Native" [level=3] [ref=e106]
                                - paragraph [ref=e107]: Rubcube · Remoto, Brasil
                                - paragraph [ref=e108]: Jan 2022 – Mar 2023 · 1 yr 2 mo
                            - button "Expand details" [ref=e109] [cursor=pointer]:
                                - img [ref=e110]
                        - paragraph [ref=e112]: "Atuação no desenvolvimento do aplicativo móvel do cliente Banco Digi+, com foco em funcionalidades bancárias e experiência do usuário. ### Conquistas - Criou módulo Pix completo do zero para o Banco Digi+, incluindo todas as funcionalidades de transferência e pagamento - Efetuou manutenção e correções de bugs no aplicativo bancário - Trabalhou com MongoDB para persistência de dados - Desenvolveu componentes React Native em formato funcional e de classes - Desenvolveu website da empresa utilizando React JS - Experiência com integração de APIs REST para serviços bancários"
                    - article [ref=e113]:
                        - generic [ref=e114]:
                            - generic [ref=e115]:
                                - heading "Desenvolvedor Android/Flutter" [level=3] [ref=e116]
                                - paragraph [ref=e117]: Engeselt · Remoto, Brasil
                                - paragraph [ref=e118]: Apr 2021 – Oct 2021 · 6 mo
                            - button "Expand details" [ref=e119] [cursor=pointer]:
                                - img [ref=e120]
                        - paragraph [ref=e122]: "Entrada na empresa para efetuar prova de conceito do mestrado sobre dados GNSS (GPS). Após conclusão, permaneceu na empresa para atuação em produtos próprios do setor elétrico. ### Conquistas - Desenvolveu prova de conceito utilizando dados GNSS (GPS) do mestrado - Efetuou manutenção e correções de bugs no aplicativo da empresa do setor elétrico - Trabalhou com Flutter MobX para gerenciamento de estado - Implementou funcionalidades offline-first com SQFlite e OpenStreetMaps - Desenvolveu em Android Nativo utilizando Java e XML - Aplicou conhecimentos acadêmicos de GNSS em aplicações práticas"
                - generic [ref=e124]:
                    - heading "Timeline" [level=3] [ref=e125]
                    - list "Timeline" [ref=e126]:
                        - listitem [ref=e128]:
                            - generic "Work" [ref=e129]:
                                - generic [ref=e130]: Work
                            - time [ref=e131]: Feb 2023 – Present · 3 yrs 3 mo
                            - generic [ref=e132]:
                                - heading "Desenvolvedor Mobile React Native" [level=3] [ref=e133]
                                - paragraph [ref=e134]: Topaz · Remoto, Brasil
                                - paragraph [ref=e135]: "Atuação no produto interno da empresa, voltado ao setor bancário. Desenvolvimento e manutenção de aplicativos móveis para instituições financeiras, com foco em funcionalidades críticas e experiência do usuário. ### Conquistas - Desenvolveu e implementou módulo Pix completo para aplicativos bancários, incluindo integração com DICT (Diretório de Identificadores de Contas Transacionais) - Implementou Login Biométrico com integração Daon para autenticação segura - Criou módulo de Empréstimo com fluxo completo de solicitação e aprovação - Prestou manutenção e correção de bugs em aplicativos bancários críticos - Atuou em projetos para clientes específicos: CrediSIS (Brasil), Bradescard (México), Banco Macro (Argentina) e Banco do Nordeste - BNB (Brasil) - Trabalhou com Google Play Console, Apple Developer e TestFlight para distribuição de apps - Implementou testes unitários com Jest para garantir qualidade do código - Utilizou ferramentas de monitoramento (Elastic, Kibana, Grafana) para análise de performance - Experiência com metodologias ágeis e comunicação eficiente com stakeholders (POs, BAs, QAs, SMs) - Orientação de desenvolvedores júnior em boas práticas de desenvolvimento React Native"
                        - listitem [ref=e136]:
                            - generic "Work" [ref=e137]:
                                - generic [ref=e138]: Work
                            - time [ref=e139]: Oct 2021 – Jan 2022 · 3 mo
                            - generic [ref=e140]:
                                - heading "Desenvolvedor Flutter" [level=3] [ref=e141]
                                - paragraph [ref=e142]: Rubcube · Remoto, Brasil
                                - paragraph [ref=e143]: "Atuação no aplicativo móvel do cliente Virtus Pay, focando em manutenção e qualidade do código. ### Conquistas - Efetuou manutenção e correções de bugs no aplicativo Virtus Pay - Trabalhou com Flutter para desenvolvimento multiplataforma - Experiência com aplicativos de pagamento digital"
                        - listitem [ref=e144]:
                            - generic "Work" [ref=e145]:
                                - generic [ref=e146]: Work
                            - time [ref=e147]: Jan 2022 – Mar 2023 · 1 yr 2 mo
                            - generic [ref=e148]:
                                - heading "Desenvolvedor Mobile React Native" [level=3] [ref=e149]
                                - paragraph [ref=e150]: Rubcube · Remoto, Brasil
                                - paragraph [ref=e151]: "Atuação no desenvolvimento do aplicativo móvel do cliente Banco Digi+, com foco em funcionalidades bancárias e experiência do usuário. ### Conquistas - Criou módulo Pix completo do zero para o Banco Digi+, incluindo todas as funcionalidades de transferência e pagamento - Efetuou manutenção e correções de bugs no aplicativo bancário - Trabalhou com MongoDB para persistência de dados - Desenvolveu componentes React Native em formato funcional e de classes - Desenvolveu website da empresa utilizando React JS - Experiência com integração de APIs REST para serviços bancários"
                        - listitem [ref=e152]:
                            - generic "Work" [ref=e153]:
                                - generic [ref=e154]: Work
                            - time [ref=e155]: Apr 2021 – Oct 2021 · 6 mo
                            - generic [ref=e156]:
                                - heading "Desenvolvedor Android/Flutter" [level=3] [ref=e157]
                                - paragraph [ref=e158]: Engeselt · Remoto, Brasil
                                - paragraph [ref=e159]: "Entrada na empresa para efetuar prova de conceito do mestrado sobre dados GNSS (GPS). Após conclusão, permaneceu na empresa para atuação em produtos próprios do setor elétrico. ### Conquistas - Desenvolveu prova de conceito utilizando dados GNSS (GPS) do mestrado - Efetuou manutenção e correções de bugs no aplicativo da empresa do setor elétrico - Trabalhou com Flutter MobX para gerenciamento de estado - Implementou funcionalidades offline-first com SQFlite e OpenStreetMaps - Desenvolveu em Android Nativo utilizando Java e XML - Aplicou conhecimentos acadêmicos de GNSS em aplicações práticas"
        - region "Skills" [ref=e161]:
            - generic [ref=e162]:
                - heading "Skills" [level=2] [ref=e163]
                - generic [ref=e164]:
                    - generic [ref=e165]: Filter skills
                    - searchbox "Filter skills by name" [ref=e166]
                - generic [ref=e167]:
                    - generic [ref=e168]:
                        - heading "Mobile Development" [level=2] [ref=e169]
                        - list "Mobile Development skills" [ref=e170]:
                            - listitem [ref=e171]:
                                - generic [ref=e172]: React Native
                                - 'generic "Level: expert" [ref=e173]': expert
                            - listitem [ref=e174]:
                                - generic [ref=e175]: Flutter
                                - 'generic "Level: intermediate" [ref=e176]': intermediate
                            - listitem [ref=e177]:
                                - generic [ref=e178]: Android Nativo (Java)
                                - 'generic "Level: advanced" [ref=e179]': advanced
                            - listitem [ref=e180]:
                                - generic [ref=e181]: TypeScript
                                - 'generic "Level: advanced" [ref=e182]': advanced
                            - listitem [ref=e183]:
                                - generic [ref=e184]: JavaScript
                                - 'generic "Level: expert" [ref=e185]': expert
                    - generic [ref=e186]:
                        - heading "State Management & Architecture" [level=2] [ref=e187]
                        - list "State Management & Architecture skills" [ref=e188]:
                            - listitem [ref=e189]:
                                - generic [ref=e190]: Redux/Saga
                                - 'generic "Level: advanced" [ref=e191]': advanced
                            - listitem [ref=e192]:
                                - generic [ref=e193]: Jotai
                                - 'generic "Level: intermediate" [ref=e194]': intermediate
                            - listitem [ref=e195]:
                                - generic [ref=e196]: TankStack
                                - 'generic "Level: intermediate" [ref=e197]': intermediate
                            - listitem [ref=e198]:
                                - generic [ref=e199]: MobX
                                - 'generic "Level: intermediate" [ref=e200]': intermediate
                    - generic [ref=e201]:
                        - heading "UI & Styling" [level=2] [ref=e202]
                        - list "UI & Styling skills" [ref=e203]:
                            - listitem [ref=e204]:
                                - generic [ref=e205]: React Native StyleSheet
                                - 'generic "Level: expert" [ref=e206]': expert
                            - listitem [ref=e207]:
                                - generic [ref=e208]: Styled Components
                                - 'generic "Level: advanced" [ref=e209]': advanced
                            - listitem [ref=e210]:
                                - generic [ref=e211]: React JS
                                - 'generic "Level: advanced" [ref=e212]': advanced
                    - generic [ref=e213]:
                        - heading "Forms & Validation" [level=2] [ref=e214]
                        - list "Forms & Validation skills" [ref=e215]:
                            - listitem [ref=e216]:
                                - generic [ref=e217]: react-hook-form
                                - 'generic "Level: advanced" [ref=e218]': advanced
                            - listitem [ref=e219]:
                                - generic [ref=e220]: Validação de Formulários
                                - 'generic "Level: expert" [ref=e221]': expert
                    - generic [ref=e222]:
                        - heading "Testing" [level=2] [ref=e223]
                        - list "Testing skills" [ref=e224]:
                            - listitem [ref=e225]:
                                - generic [ref=e226]: Jest
                                - 'generic "Level: advanced" [ref=e227]': advanced
                            - listitem [ref=e228]:
                                - generic [ref=e229]: Testes Unitários
                                - 'generic "Level: advanced" [ref=e230]': advanced
                    - generic [ref=e231]:
                        - heading "Firebase & Cloud Services" [level=2] [ref=e232]
                        - list "Firebase & Cloud Services skills" [ref=e233]:
                            - listitem [ref=e234]:
                                - generic [ref=e235]: Firebase Analytics
                                - 'generic "Level: advanced" [ref=e236]': advanced
                            - listitem [ref=e237]:
                                - generic [ref=e238]: Firebase Crashlytics
                                - 'generic "Level: advanced" [ref=e239]': advanced
                            - listitem [ref=e240]:
                                - generic [ref=e241]: Firebase Distribution
                                - 'generic "Level: intermediate" [ref=e242]': intermediate
                            - listitem [ref=e243]:
                                - generic [ref=e244]: Firebase Storage
                                - 'generic "Level: intermediate" [ref=e245]': intermediate
                    - generic [ref=e246]:
                        - heading "APIs & Integration" [level=2] [ref=e247]
                        - list "APIs & Integration skills" [ref=e248]:
                            - listitem [ref=e249]:
                                - generic [ref=e250]: REST APIs
                                - 'generic "Level: expert" [ref=e251]': expert
                            - listitem [ref=e252]:
                                - generic [ref=e253]: AsyncStorage
                                - 'generic "Level: expert" [ref=e254]': expert
                            - listitem [ref=e255]:
                                - generic [ref=e256]: MongoDB
                                - 'generic "Level: intermediate" [ref=e257]': intermediate
                    - generic [ref=e258]:
                        - heading "Internationalization" [level=2] [ref=e259]
                        - list "Internationalization skills" [ref=e260]:
                            - listitem [ref=e261]:
                                - generic [ref=e262]: i18next
                                - 'generic "Level: advanced" [ref=e263]': advanced
                            - listitem [ref=e264]:
                                - generic [ref=e265]: Localização de Apps
                                - 'generic "Level: advanced" [ref=e266]': advanced
                    - generic [ref=e267]:
                        - heading "Native Modules & Integrations" [level=2] [ref=e268]
                        - list "Native Modules & Integrations skills" [ref=e269]:
                            - listitem [ref=e270]:
                                - generic [ref=e271]: Expo Modules
                                - 'generic "Level: intermediate" [ref=e272]': intermediate
                            - listitem [ref=e273]:
                                - generic [ref=e274]: Daon (Biometria)
                                - 'generic "Level: intermediate" [ref=e275]': intermediate
                            - listitem [ref=e276]:
                                - generic [ref=e277]: Qualtrics
                                - 'generic "Level: intermediate" [ref=e278]': intermediate
                    - generic [ref=e279]:
                        - heading "Database & Storage" [level=2] [ref=e280]
                        - list "Database & Storage skills" [ref=e281]:
                            - listitem [ref=e282]:
                                - generic [ref=e283]: SQFlite
                                - 'generic "Level: intermediate" [ref=e284]': intermediate
                            - listitem [ref=e285]:
                                - generic [ref=e286]: AsyncStorage
                                - 'generic "Level: expert" [ref=e287]': expert
                            - listitem [ref=e288]:
                                - generic [ref=e289]: MongoDB
                                - 'generic "Level: intermediate" [ref=e290]': intermediate
                    - generic [ref=e291]:
                        - heading "Maps & Location" [level=2] [ref=e292]
                        - list "Maps & Location skills" [ref=e293]:
                            - listitem [ref=e294]:
                                - generic [ref=e295]: OpenStreetMaps
                                - 'generic "Level: intermediate" [ref=e296]': intermediate
                            - listitem [ref=e297]:
                                - generic [ref=e298]: GNSS/GPS
                                - 'generic "Level: expert" [ref=e299]': expert
                            - listitem [ref=e300]:
                                - generic [ref=e301]: Geolocalização
                                - 'generic "Level: advanced" [ref=e302]': advanced
                    - generic [ref=e303]:
                        - heading "DevOps & CI/CD" [level=2] [ref=e304]
                        - list "DevOps & CI/CD skills" [ref=e305]:
                            - listitem [ref=e306]:
                                - generic [ref=e307]: Google Play Console
                                - 'generic "Level: advanced" [ref=e308]': advanced
                            - listitem [ref=e309]:
                                - generic [ref=e310]: Apple Developer
                                - 'generic "Level: advanced" [ref=e311]': advanced
                            - listitem [ref=e312]:
                                - generic [ref=e313]: TestFlight
                                - 'generic "Level: advanced" [ref=e314]': advanced
                            - listitem [ref=e315]:
                                - generic [ref=e316]: Jenkins
                                - 'generic "Level: intermediate" [ref=e317]': intermediate
                            - listitem [ref=e318]:
                                - generic [ref=e319]: Fastlane
                                - 'generic "Level: intermediate" [ref=e320]': intermediate
                            - listitem [ref=e321]:
                                - generic [ref=e322]: Git/GitHub/GitLab
                                - 'generic "Level: expert" [ref=e323]': expert
                    - generic [ref=e324]:
                        - heading "Monitoring & Analytics" [level=2] [ref=e325]
                        - list "Monitoring & Analytics skills" [ref=e326]:
                            - listitem [ref=e327]:
                                - generic [ref=e328]: Elastic
                                - 'generic "Level: intermediate" [ref=e329]': intermediate
                            - listitem [ref=e330]:
                                - generic [ref=e331]: Kibana
                                - 'generic "Level: intermediate" [ref=e332]': intermediate
                            - listitem [ref=e333]:
                                - generic [ref=e334]: Grafana
                                - 'generic "Level: intermediate" [ref=e335]': intermediate
                    - generic [ref=e336]:
                        - heading "Project Management" [level=2] [ref=e337]
                        - list "Project Management skills" [ref=e338]:
                            - listitem [ref=e339]:
                                - generic [ref=e340]: Jira
                                - 'generic "Level: advanced" [ref=e341]': advanced
                            - listitem [ref=e342]:
                                - generic [ref=e343]: Confluence
                                - 'generic "Level: intermediate" [ref=e344]': intermediate
                            - listitem [ref=e345]:
                                - generic [ref=e346]: Metodologias Ágeis
                                - 'generic "Level: advanced" [ref=e347]': advanced
                    - generic [ref=e348]:
                        - heading "Backend & Desktop" [level=2] [ref=e349]
                        - list "Backend & Desktop skills" [ref=e350]:
                            - listitem [ref=e351]:
                                - generic [ref=e352]: Java
                                - 'generic "Level: advanced" [ref=e353]': advanced
                            - listitem [ref=e354]:
                                - generic [ref=e355]: Java Swing
                                - 'generic "Level: intermediate" [ref=e356]': intermediate
                            - listitem [ref=e357]:
                                - generic [ref=e358]: Python
                                - 'generic "Level: intermediate" [ref=e359]': intermediate
                            - listitem [ref=e360]:
                                - generic [ref=e361]: C++
                                - 'generic "Level: intermediate" [ref=e362]': intermediate
                    - generic [ref=e363]:
                        - heading "Domain Knowledge" [level=2] [ref=e364]
                        - list "Domain Knowledge skills" [ref=e365]:
                            - listitem [ref=e366]:
                                - generic [ref=e367]: Sistema Pix (DICT)
                                - 'generic "Level: expert" [ref=e368]': expert
                            - listitem [ref=e369]:
                                - generic [ref=e370]: Aplicações Bancárias
                                - 'generic "Level: expert" [ref=e371]': expert
                            - listitem [ref=e372]:
                                - generic [ref=e373]: Biometria e Autenticação
                                - 'generic "Level: advanced" [ref=e374]': advanced
                            - listitem [ref=e375]:
                                - generic [ref=e376]: Processamento de Imagens
                                - 'generic "Level: intermediate" [ref=e377]': intermediate
                            - listitem [ref=e378]:
                                - generic [ref=e379]: Ciências Cartográficas
                                - 'generic "Level: advanced" [ref=e380]': advanced
                    - generic [ref=e381]:
                        - heading "Languages" [level=2] [ref=e382]
                        - list "Languages skills" [ref=e383]:
                            - listitem [ref=e384]:
                                - generic [ref=e385]: Português (Nativo)
                                - 'generic "Level: expert" [ref=e386]': expert
                            - listitem [ref=e387]:
                                - generic [ref=e388]: Inglês (Intermediário-Avançado B2)
                                - 'generic "Level: advanced" [ref=e389]': advanced
                    - generic [ref=e390]:
                        - heading "Soft Skills" [level=2] [ref=e391]
                        - list "Soft Skills skills" [ref=e392]:
                            - listitem [ref=e393]:
                                - generic [ref=e394]: Comunicação com Stakeholders
                                - 'generic "Level: expert" [ref=e395]': expert
                            - listitem [ref=e396]:
                                - generic [ref=e397]: Orientação de Desenvolvedores
                                - 'generic "Level: advanced" [ref=e398]': advanced
                            - listitem [ref=e399]:
                                - generic [ref=e400]: Trabalho em Equipe
                                - 'generic "Level: expert" [ref=e401]': expert
                            - listitem [ref=e402]:
                                - generic [ref=e403]: Resolução de Problemas
                                - 'generic "Level: expert" [ref=e404]': expert
                            - listitem [ref=e405]:
                                - generic [ref=e406]: Metodologias Ágeis
                                - 'generic "Level: advanced" [ref=e407]': advanced
        - region "Projects" [ref=e409]:
            - generic [ref=e410]:
                - heading "Projects" [level=2] [ref=e411]
                - group "Filter by technology" [ref=e412]:
                    - button "All" [pressed] [ref=e413] [cursor=pointer]
                    - button "Android Architecture Components" [ref=e414] [cursor=pointer]
                    - button "Android SDK" [ref=e415] [cursor=pointer]
                    - button "Data Processing" [ref=e416] [cursor=pointer]
                    - button "Firebase Analytics" [ref=e417] [cursor=pointer]
                    - button "Firebase Crashlytics" [ref=e418] [cursor=pointer]
                    - button "GNSS/GPS" [ref=e419] [cursor=pointer]
                    - button "Java" [ref=e420] [cursor=pointer]
                    - button "Jest" [ref=e421] [cursor=pointer]
                    - button "Material Design" [ref=e422] [cursor=pointer]
                    - button "NMEA Protocol" [ref=e423] [cursor=pointer]
                    - button "Next.js 16" [ref=e424] [cursor=pointer]
                    - button "Playwright" [ref=e425] [cursor=pointer]
                    - button "SQLite" [ref=e426] [cursor=pointer]
                    - button "Scientific Computing" [ref=e427] [cursor=pointer]
                    - button "Sentry" [ref=e428] [cursor=pointer]
                    - button "Tailwind CSS" [ref=e429] [cursor=pointer]
                    - button "TypeScript" [ref=e430] [cursor=pointer]
                    - button "Vercel" [ref=e431] [cursor=pointer]
                    - button "next-intl" [ref=e432] [cursor=pointer]
                - generic [ref=e433]:
                    - button "View details for Personal Resume Website" [ref=e435] [cursor=pointer]:
                        - img "Personal Resume Website screenshot 1" [ref=e437]
                        - generic [ref=e438]:
                            - heading "Personal Resume Website" [level=3] [ref=e439]
                            - generic [ref=e441]: Featured
                        - paragraph [ref=e442]: Site de currículo pessoal moderno e responsivo com suporte multilíngue, modo escuro, e integração completa com Firebase Analytics
                        - generic [ref=e443]:
                            - generic [ref=e444]: Next.js 16
                            - generic [ref=e445]: TypeScript
                            - generic [ref=e446]: Tailwind CSS
                            - generic [ref=e447]: Firebase Analytics
                            - generic [ref=e448]: +6 more
                    - button "View details for Android Native Crud" [ref=e450] [cursor=pointer]:
                        - img "Android Native Crud screenshot 1" [ref=e452]
                        - heading "Android Native Crud" [level=3] [ref=e454]
                        - paragraph [ref=e455]: Aplicação de exemplo para estudo inicial do ambiente Android, explorando componentes fundamentais e padrões de desenvolvimento
                        - generic [ref=e456]:
                            - generic [ref=e457]: Java
                            - generic [ref=e458]: Android SDK
                            - generic [ref=e459]: Material Design
                            - generic [ref=e460]: SQLite
                            - generic [ref=e461]: +1 more
                    - button "View details for INCT GNSS App" [ref=e463] [cursor=pointer]:
                        - img "INCT GNSS App screenshot 1" [ref=e465]
                        - generic [ref=e466]:
                            - heading "INCT GNSS App" [level=3] [ref=e467]
                            - generic [ref=e469]: Featured
                        - paragraph [ref=e470]: Aplicação Android para análise de dados GNSS (GPS) coletados pelo Google GNSSLogger, com processamento de medições NMEA
                        - generic [ref=e471]:
                            - generic [ref=e472]: Java
                            - generic [ref=e473]: Android SDK
                            - generic [ref=e474]: GNSS/GPS
                            - generic [ref=e475]: NMEA Protocol
                            - generic [ref=e476]: +2 more
        - region "Get in Touch" [ref=e477]:
            - generic [ref=e478]:
                - heading "Get in Touch" [level=2] [ref=e479]
                - paragraph [ref=e480]: Have a project in mind or want to chat? Send me a message!
                - generic [ref=e482]:
                    - img [ref=e483]
                    - generic [ref=e486]:
                        - paragraph [ref=e487]: Professional Email
                        - link "contact@rogeriodocarmo.com" [ref=e488]:
                            - /url: mailto:contact@rogeriodocarmo.com
                        - paragraph [ref=e489]: Or use the form below to send me a message
                - form "Contact form" [ref=e490]:
                    - generic [ref=e491]:
                        - generic [ref=e492]: Name *
                        - textbox "Name" [ref=e493]:
                            - /placeholder: Your name
                    - generic [ref=e494]:
                        - generic [ref=e495]: Email *
                        - textbox "Email" [ref=e496]:
                            - /placeholder: your@email.com
                    - generic [ref=e497]:
                        - generic [ref=e498]: Message *
                        - textbox "Message" [ref=e499]:
                            - /placeholder: Your message (at least 10 characters)
                    - button "Send Message" [ref=e500] [cursor=pointer]
        - dialog "Hey, wait!" [ref=e502]:
            - button "Close" [active] [ref=e503] [cursor=pointer]:
                - img [ref=e504]
            - heading "Hey, wait!" [level=2] [ref=e506]
            - generic [ref=e508]:
                - generic [ref=e509]:
                    - heading "Before you go..." [level=2] [ref=e510]
                    - paragraph [ref=e511]: Would you like to connect or download my resume?
                - generic [ref=e512]:
                    - button "Download Resume (PDF)" [ref=e513] [cursor=pointer]:
                        - img [ref=e514]
                        - text: Download Resume (PDF)
                    - button "Connect on LinkedIn" [ref=e516] [cursor=pointer]:
                        - img [ref=e517]
                        - text: Connect on LinkedIn
                    - button "Star on GitHub" [ref=e519] [cursor=pointer]:
                        - img [ref=e520]
                        - text: Star on GitHub
                - paragraph [ref=e522]: Thanks for visiting!
                - generic [ref=e523]:
                    - paragraph [ref=e524]: "Or leave your email and I'll reach out:"
                    - generic [ref=e526]:
                        - generic [ref=e527]: Email address
                        - textbox "Email address" [ref=e528]:
                            - /placeholder: your@email.com
                        - button "Contact me" [ref=e529] [cursor=pointer]
    - contentinfo [ref=e530]:
        - generic [ref=e531]:
            - generic [ref=e532]:
                - generic [ref=e533]:
                    - heading "Navigate" [level=2] [ref=e534]
                    - list [ref=e535]:
                        - listitem [ref=e536]:
                            - link "Home" [ref=e537]:
                                - /url: "#home"
                        - listitem [ref=e538]:
                            - link "Projects" [ref=e539]:
                                - /url: "#projects"
                        - listitem [ref=e540]:
                            - link "Experience" [ref=e541]:
                                - /url: "#experience"
                        - listitem [ref=e542]:
                            - link "Skills" [ref=e543]:
                                - /url: "#skills"
                        - listitem [ref=e544]:
                            - link "Contact" [ref=e545]:
                                - /url: "#contact"
                        - listitem [ref=e546]:
                            - link "Used in this site" [ref=e547]:
                                - /url: "#tech-stack"
                - generic [ref=e548]:
                    - heading "Languages" [level=2] [ref=e549]
                    - list [ref=e550]:
                        - listitem [ref=e551]:
                            - link "Português (pt-BR)" [ref=e552]:
                                - /url: /pt-BR
                        - listitem [ref=e553]:
                            - link "English (en)" [ref=e554]:
                                - /url: /en
                        - listitem [ref=e555]:
                            - link "Español (es)" [ref=e556]:
                                - /url: /es
                - generic [ref=e557]:
                    - heading "Connect" [level=2] [ref=e558]
                    - list [ref=e559]:
                        - listitem [ref=e560]:
                            - link "Professional Email" [ref=e561]:
                                - /url: mailto:contact@rogeriodocarmo.com
                                - img [ref=e562]
                                - generic [ref=e565]: contact@rogeriodocarmo.com
                        - listitem [ref=e566]:
                            - link "Download resume in PDF format" [ref=e567]:
                                - /url: /resumes/resume.pdf
                                - img [ref=e568]
                                - generic [ref=e570]: Download Resume
                        - listitem [ref=e571]:
                            - link "Download master's dissertation in PDF format" [ref=e572]:
                                - /url: /academic/masters_degree_dissertation_rogerio_do_carmo.pdf
                                - img [ref=e573]
                                - generic [ref=e575]: Download Dissertation
                        - listitem [ref=e576]:
                            - link "Linktree profile" [ref=e577]:
                                - /url: https://linktr.ee/rogeriodocarmo
                                - img [ref=e578]
                                - generic [ref=e580]: Linktree
                        - listitem [ref=e581]:
                            - link "LinkedIn profile" [ref=e582]:
                                - /url: https://www.linkedin.com/in/rogeriodocarmo/
                                - img [ref=e583]
                                - generic [ref=e585]: LinkedIn
                        - listitem [ref=e586]:
                            - link "GitHub profile" [ref=e587]:
                                - /url: https://github.com/RogerioDoCarmo/curriculo
                                - img [ref=e588]
                                - generic [ref=e590]: GitHub
                        - listitem [ref=e591]:
                            - button "Print site page" [ref=e592] [cursor=pointer]:
                                - img [ref=e593]
                                - generic [ref=e597]: Print Page
            - paragraph [ref=e599]: © 2026 Rogério do Carmo. All rights reserved.
    - alert [ref=e600]
    - dialog "This site uses cookies" [ref=e601]:
        - generic [ref=e602]:
            - heading "This site uses cookies" [level=2] [ref=e603]
            - paragraph [ref=e604]: We use essential cookies for site functionality and analytics cookies to understand how you interact with our content. All analytics data is anonymous and does not include personal information.
            - generic [ref=e605]:
                - generic [ref=e606]:
                    - img [ref=e608]
                    - generic [ref=e610]:
                        - paragraph [ref=e611]: Essential Cookies
                        - paragraph [ref=e612]: Required for basic site functionality (theme, language, session). Always active.
                - generic [ref=e613]:
                    - img [ref=e615]
                    - generic [ref=e617]:
                        - paragraph [ref=e618]: Analytics Cookies
                        - paragraph [ref=e619]: Help understand how visitors interact with the site through Firebase Analytics. Anonymous data.
            - generic [ref=e620]:
                - button "Accept All" [ref=e621] [cursor=pointer]
                - button "Reject Non-Essential" [ref=e622] [cursor=pointer]
                - button "Customize" [ref=e623] [cursor=pointer]
            - paragraph [ref=e624]:
                - text: Learn more in our
                - link "Privacy Policy" [ref=e625]:
                    - /url: /privacy
                - text: and
                - link "Cookie Policy" [ref=e626]:
                    - /url: /cookies
```

# Test source

```ts
  1   | /**
  2   |  * E2E tests for EmailSubscribeForm.
  3   |  * Tests the email capture form on the main page and in the exit intent modal.
  4   |  */
  5   |
  6   | import { test, expect } from "@playwright/test";
  7   | import { dismissCookieBanner } from "./helpers/dismissCookieBanner";
  8   |
  9   | test.describe("EmailSubscribeForm - main page", () => {
  10  |   test.beforeEach(async ({ page }) => {
  11  |     await page.goto("/en");
  12  |     await dismissCookieBanner(page);
  13  |     // Scroll to the contact section
  14  |     await page.locator("#contact").scrollIntoViewIfNeeded();
  15  |   });
  16  |
  17  |   test("renders email input and submit button", async ({ page }) => {
  18  |     const section = page.locator("#contact");
  19  |     await expect(section.locator('input[id="contact-email"]')).toBeVisible();
  20  |     await expect(section.locator('button[type="submit"]')).toBeVisible();
  21  |   });
  22  |
  23  |   test("shows validation error for empty submission", async ({ page }) => {
  24  |     const section = page.locator("#contact");
  25  |     await section.locator('button[type="submit"]').click();
  26  |     await expect(section.locator("text=Email is required")).toBeVisible();
  27  |   });
  28  |
  29  |   test.skip("shows validation error for invalid email", async ({ page }) => {
  30  |     const section = page.locator("#contact");
  31  |     await section.locator('input[id="contact-email"]').fill("not-an-email");
  32  |     await section.locator('button[type="submit"]').click();
  33  |     await expect(section.locator("text=Enter a valid email")).toBeVisible();
  34  |   });
  35  |
  36  |   test("submits valid email and shows success message", async ({ page }) => {
  37  |     // Intercept the Formspree request
  38  |     await page.route("**/formspree.io/**", (route) => {
  39  |       route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
  40  |     });
  41  |
  42  |     const section = page.locator("#contact");
  43  |     // Fill all required fields
  44  |     await section.locator('input[id="contact-name"]').fill("Test User");
  45  |     await section.locator('input[id="contact-email"]').fill("test@example.com");
  46  |     await section.locator('textarea[id="contact-message"]').fill("This is a test message");
  47  |     await section.locator('button[type="submit"]').click();
  48  |
  49  |     await expect(section.locator("text=/success|sent|thank/i")).toBeVisible({ timeout: 5000 });
  50  |   });
  51  |
  52  |   test("shows error message on API failure", async ({ page }) => {
  53  |     await page.route("**/formspree.io/**", (route) => {
  54  |       route.fulfill({ status: 500, body: JSON.stringify({ error: "Server error" }) });
  55  |     });
  56  |
  57  |     const section = page.locator("#contact");
  58  |     // Fill all required fields
  59  |     await section.locator('input[id="contact-name"]').fill("Test User");
  60  |     await section.locator('input[id="contact-email"]').fill("test@example.com");
  61  |     await section.locator('textarea[id="contact-message"]').fill("This is a test message");
  62  |     await section.locator('button[type="submit"]').click();
  63  |
  64  |     await expect(section.locator("text=/error|wrong|failed/i")).toBeVisible({ timeout: 5000 });
  65  |   });
  66  | });
  67  |
  68  | test.describe("EmailSubscribeForm - exit intent modal", () => {
  69  |   // Exit intent detection is disabled on mobile (< 768px viewport)
  70  |   // and relies on mouse movement which doesn't exist on touch devices.
  71  |   // These tests only run on desktop browsers.
  72  |   test.skip(({ isMobile }) => isMobile, "Exit intent is disabled on mobile viewports");
  73  |
  74  |   test.beforeEach(async ({ page }) => {
  75  |     await page.goto("/en");
  76  |     await dismissCookieBanner(page);
  77  |   });
  78  |
  79  |   test("email form is present in exit intent modal", async ({ page }) => {
  80  |     // Trigger exit intent by moving mouse to top of viewport
  81  |     await page.waitForTimeout(6000); // wait past minTimeOnPage (5s)
  82  |     await page.mouse.move(400, 100);
  83  |     await page.mouse.move(400, 5); // cross the threshold
  84  |
  85  |     const modal = page.locator('[role="dialog"]');
> 86  |     await expect(modal).toBeVisible({ timeout: 2000 });
      |                         ^ Error: expect(locator).toBeVisible() failed
  87  |
  88  |     await expect(modal.locator('input[type="email"]')).toBeVisible();
  89  |     await expect(modal.locator("text=Contact me")).toBeVisible();
  90  |   });
  91  |
  92  |   test("submits email from exit intent modal", async ({ page }) => {
  93  |     await page.route("**/formspree.io/**", (route) => {
  94  |       route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
  95  |     });
  96  |
  97  |     await page.waitForTimeout(6000);
  98  |     await page.mouse.move(400, 100);
  99  |     await page.mouse.move(400, 5);
  100 |
  101 |     const modal = page.locator('[role="dialog"]');
  102 |     await expect(modal).toBeVisible({ timeout: 2000 });
  103 |
  104 |     await modal.locator('input[type="email"]').fill("modal@example.com");
  105 |     await modal.locator("text=Contact me").click();
  106 |
  107 |     await expect(modal.locator("text=Got it!")).toBeVisible({ timeout: 5000 });
  108 |   });
  109 | });
  110 |
```
