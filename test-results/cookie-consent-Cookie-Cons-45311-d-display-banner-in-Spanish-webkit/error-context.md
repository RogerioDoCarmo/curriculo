# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cookie-consent.spec.ts >> Cookie Consent Banner >> Multi-language support >> should display banner in Spanish
- Location: tests/e2e/cookie-consent.spec.ts:419:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('dialog').getByText(/cookies/i)
Expected: visible
Error: strict mode violation: getByRole('dialog').getByText(/cookies/i) resolved to 5 elements:
    1) <h2 id="cookie-consent-title" class="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">Este sitio usa cookies</h2> aka getByRole('heading', { name: 'Este sitio usa cookies' })
    2) <p class="mb-6 text-sm text-gray-600 dark:text-gray-300">Usamos cookies esenciales para el funcionamiento …</p> aka getByText('Usamos cookies esenciales')
    3) <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Cookies Esenciales</p> aka getByText('Cookies Esenciales', { exact: true })
    4) <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Cookies de Análisis</p> aka getByText('Cookies de Análisis', { exact: true })
    5) <a href="/cookies" class="text-primary-600 underline hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">Política de Cookies</a> aka getByRole('link', { name: 'Política de Cookies' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('dialog').getByText(/cookies/i)

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
    - banner [ref=e2]:
        - generic [ref=e4]:
            - navigation "Main navigation" [ref=e5]:
                - link "Inicio" [ref=e6]:
                    - /url: "#home"
                - link "Proyectos" [ref=e7]:
                    - /url: "#projects"
                - link "Experiencia" [ref=e8]:
                    - /url: "#experience"
                - link "Habilidades" [ref=e9]:
                    - /url: "#skills"
                - link "Contacto" [ref=e10]:
                    - /url: "#contact"
                - link "Usado en este sitio" [ref=e11]:
                    - /url: /es/tech-stack/
            - generic [ref=e12]:
                - link "Linktree profile" [ref=e13]:
                    - /url: https://linktr.ee/rogeriodocarmo
                    - img [ref=e14]
                    - generic [ref=e16]: Linktree
                - generic [ref=e17]:
                    - generic [ref=e18]: Select language
                    - generic [ref=e19]: 🇪🇸
                    - combobox "Select language" [ref=e20] [cursor=pointer]:
                        - option "🇧🇷 Português (BR)"
                        - option "🇺🇸 English"
                        - option "🇪🇸 Español" [selected]
                    - generic: ▾
                - button "Switch to dark mode" [ref=e21] [cursor=pointer]:
                    - img "Moon" [ref=e22]: 🌙
    - main [ref=e23]:
        - region "Hero section" [ref=e25]:
            - generic [ref=e26]:
                - generic [ref=e27]:
                    - paragraph [ref=e28]: Hola, soy
                    - heading "Rogério do Carmo" [level=1] [ref=e29]
                    - paragraph [ref=e30]: Desarrollador Frontend Mobile React Native
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
                        - link "Ver Mi Trabajo" [ref=e56]:
                            - /url: "#projects"
                        - link "Ponte en Contacto" [ref=e57]:
                            - /url: mailto:contact@rogeriodocarmo.com
                            - img [ref=e58]
                            - text: Ponte en Contacto
                    - paragraph [ref=e61]:
                        - link "contact@rogeriodocarmo.com" [ref=e62]:
                            - /url: mailto:contact@rogeriodocarmo.com
                - img "Rogério do Carmo — Mobile React Native Developer" [ref=e65]
        - tablist "Elige un Camino" [ref=e68]:
            - generic [ref=e69]:
                - tab "Profesional" [selected] [ref=e70] [cursor=pointer]:
                    - img [ref=e71]
                    - text: Profesional
                - tab "Académico" [ref=e73] [cursor=pointer]:
                    - img [ref=e74]
                    - text: Académico
        - region "Experiencia Profesional experiencia" [ref=e79]:
            - generic [ref=e80]:
                - heading "Experiencia Profesional" [level=2] [ref=e81]
                - generic [ref=e82]:
                    - article [ref=e83]:
                        - generic [ref=e84]:
                            - generic [ref=e85]:
                                - heading "Desenvolvedor Mobile React Native" [level=3] [ref=e86]
                                - paragraph [ref=e87]: Topaz · Remoto, Brasil
                                - paragraph [ref=e88]: Feb 2023 – Presente · 3 yrs 3 mo
                            - button "Expandir detalles" [ref=e89] [cursor=pointer]:
                                - img [ref=e90]
                        - paragraph [ref=e92]: "Atuação no produto interno da empresa, voltado ao setor bancário. Desenvolvimento e manutenção de aplicativos móveis para instituições financeiras, com foco em funcionalidades críticas e experiência do usuário. ### Conquistas - Desenvolveu e implementou módulo Pix completo para aplicativos bancários, incluindo integração com DICT (Diretório de Identificadores de Contas Transacionais) - Implementou Login Biométrico com integração Daon para autenticação segura - Criou módulo de Empréstimo com fluxo completo de solicitação e aprovação - Prestou manutenção e correção de bugs em aplicativos bancários críticos - Atuou em projetos para clientes específicos: CrediSIS (Brasil), Bradescard (México), Banco Macro (Argentina) e Banco do Nordeste - BNB (Brasil) - Trabalhou com Google Play Console, Apple Developer e TestFlight para distribuição de apps - Implementou testes unitários com Jest para garantir qualidade do código - Utilizou ferramentas de monitoramento (Elastic, Kibana, Grafana) para análise de performance - Experiência com metodologias ágeis e comunicação eficiente com stakeholders (POs, BAs, QAs, SMs) - Orientação de desenvolvedores júnior em boas práticas de desenvolvimento React Native"
                    - article [ref=e93]:
                        - generic [ref=e94]:
                            - generic [ref=e95]:
                                - heading "Desenvolvedor Flutter" [level=3] [ref=e96]
                                - paragraph [ref=e97]: Rubcube · Remoto, Brasil
                                - paragraph [ref=e98]: Oct 2021 – Jan 2022 · 3 mo
                            - button "Expandir detalles" [ref=e99] [cursor=pointer]:
                                - img [ref=e100]
                        - paragraph [ref=e102]: "Atuação no aplicativo móvel do cliente Virtus Pay, focando em manutenção e qualidade do código. ### Conquistas - Efetuou manutenção e correções de bugs no aplicativo Virtus Pay - Trabalhou com Flutter para desenvolvimento multiplataforma - Experiência com aplicativos de pagamento digital"
                    - article [ref=e103]:
                        - generic [ref=e104]:
                            - generic [ref=e105]:
                                - heading "Desenvolvedor Mobile React Native" [level=3] [ref=e106]
                                - paragraph [ref=e107]: Rubcube · Remoto, Brasil
                                - paragraph [ref=e108]: Jan 2022 – Mar 2023 · 1 yr 2 mo
                            - button "Expandir detalles" [ref=e109] [cursor=pointer]:
                                - img [ref=e110]
                        - paragraph [ref=e112]: "Atuação no desenvolvimento do aplicativo móvel do cliente Banco Digi+, com foco em funcionalidades bancárias e experiência do usuário. ### Conquistas - Criou módulo Pix completo do zero para o Banco Digi+, incluindo todas as funcionalidades de transferência e pagamento - Efetuou manutenção e correções de bugs no aplicativo bancário - Trabalhou com MongoDB para persistência de dados - Desenvolveu componentes React Native em formato funcional e de classes - Desenvolveu website da empresa utilizando React JS - Experiência com integração de APIs REST para serviços bancários"
                    - article [ref=e113]:
                        - generic [ref=e114]:
                            - generic [ref=e115]:
                                - heading "Desenvolvedor Android/Flutter" [level=3] [ref=e116]
                                - paragraph [ref=e117]: Engeselt · Remoto, Brasil
                                - paragraph [ref=e118]: Apr 2021 – Oct 2021 · 6 mo
                            - button "Expandir detalles" [ref=e119] [cursor=pointer]:
                                - img [ref=e120]
                        - paragraph [ref=e122]: "Entrada na empresa para efetuar prova de conceito do mestrado sobre dados GNSS (GPS). Após conclusão, permaneceu na empresa para atuação em produtos próprios do setor elétrico. ### Conquistas - Desenvolveu prova de conceito utilizando dados GNSS (GPS) do mestrado - Efetuou manutenção e correções de bugs no aplicativo da empresa do setor elétrico - Trabalhou com Flutter MobX para gerenciamento de estado - Implementou funcionalidades offline-first com SQFlite e OpenStreetMaps - Desenvolveu em Android Nativo utilizando Java e XML - Aplicou conhecimentos acadêmicos de GNSS em aplicações práticas"
                - generic [ref=e124]:
                    - heading "Línea de Tiempo" [level=3] [ref=e125]
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
        - region "Habilidades" [ref=e161]:
            - generic [ref=e162]:
                - heading "Habilidades" [level=2] [ref=e163]
                - generic [ref=e164]:
                    - generic [ref=e165]: Filtrar habilidades
                    - searchbox "Filtrar habilidades por nombre" [ref=e166]
                - generic [ref=e167]:
                    - generic [ref=e168]:
                        - heading "Mobile Development" [level=2] [ref=e169]
                        - list "Mobile Development habilidades" [ref=e170]:
                            - listitem [ref=e171]:
                                - generic [ref=e172]: React Native
                                - 'generic "Nivel: expert" [ref=e173]': expert
                            - listitem [ref=e174]:
                                - generic [ref=e175]: Flutter
                                - 'generic "Nivel: intermediate" [ref=e176]': intermediate
                            - listitem [ref=e177]:
                                - generic [ref=e178]: Android Nativo (Java)
                                - 'generic "Nivel: advanced" [ref=e179]': advanced
                            - listitem [ref=e180]:
                                - generic [ref=e181]: TypeScript
                                - 'generic "Nivel: advanced" [ref=e182]': advanced
                            - listitem [ref=e183]:
                                - generic [ref=e184]: JavaScript
                                - 'generic "Nivel: expert" [ref=e185]': expert
                    - generic [ref=e186]:
                        - heading "State Management & Architecture" [level=2] [ref=e187]
                        - list "State Management & Architecture habilidades" [ref=e188]:
                            - listitem [ref=e189]:
                                - generic [ref=e190]: Redux/Saga
                                - 'generic "Nivel: advanced" [ref=e191]': advanced
                            - listitem [ref=e192]:
                                - generic [ref=e193]: Jotai
                                - 'generic "Nivel: intermediate" [ref=e194]': intermediate
                            - listitem [ref=e195]:
                                - generic [ref=e196]: TankStack
                                - 'generic "Nivel: intermediate" [ref=e197]': intermediate
                            - listitem [ref=e198]:
                                - generic [ref=e199]: MobX
                                - 'generic "Nivel: intermediate" [ref=e200]': intermediate
                    - generic [ref=e201]:
                        - heading "UI & Styling" [level=2] [ref=e202]
                        - list "UI & Styling habilidades" [ref=e203]:
                            - listitem [ref=e204]:
                                - generic [ref=e205]: React Native StyleSheet
                                - 'generic "Nivel: expert" [ref=e206]': expert
                            - listitem [ref=e207]:
                                - generic [ref=e208]: Styled Components
                                - 'generic "Nivel: advanced" [ref=e209]': advanced
                            - listitem [ref=e210]:
                                - generic [ref=e211]: React JS
                                - 'generic "Nivel: advanced" [ref=e212]': advanced
                    - generic [ref=e213]:
                        - heading "Forms & Validation" [level=2] [ref=e214]
                        - list "Forms & Validation habilidades" [ref=e215]:
                            - listitem [ref=e216]:
                                - generic [ref=e217]: react-hook-form
                                - 'generic "Nivel: advanced" [ref=e218]': advanced
                            - listitem [ref=e219]:
                                - generic [ref=e220]: Validação de Formulários
                                - 'generic "Nivel: expert" [ref=e221]': expert
                    - generic [ref=e222]:
                        - heading "Testing" [level=2] [ref=e223]
                        - list "Testing habilidades" [ref=e224]:
                            - listitem [ref=e225]:
                                - generic [ref=e226]: Jest
                                - 'generic "Nivel: advanced" [ref=e227]': advanced
                            - listitem [ref=e228]:
                                - generic [ref=e229]: Testes Unitários
                                - 'generic "Nivel: advanced" [ref=e230]': advanced
                    - generic [ref=e231]:
                        - heading "Firebase & Cloud Services" [level=2] [ref=e232]
                        - list "Firebase & Cloud Services habilidades" [ref=e233]:
                            - listitem [ref=e234]:
                                - generic [ref=e235]: Firebase Analytics
                                - 'generic "Nivel: advanced" [ref=e236]': advanced
                            - listitem [ref=e237]:
                                - generic [ref=e238]: Firebase Crashlytics
                                - 'generic "Nivel: advanced" [ref=e239]': advanced
                            - listitem [ref=e240]:
                                - generic [ref=e241]: Firebase Distribution
                                - 'generic "Nivel: intermediate" [ref=e242]': intermediate
                            - listitem [ref=e243]:
                                - generic [ref=e244]: Firebase Storage
                                - 'generic "Nivel: intermediate" [ref=e245]': intermediate
                    - generic [ref=e246]:
                        - heading "APIs & Integration" [level=2] [ref=e247]
                        - list "APIs & Integration habilidades" [ref=e248]:
                            - listitem [ref=e249]:
                                - generic [ref=e250]: REST APIs
                                - 'generic "Nivel: expert" [ref=e251]': expert
                            - listitem [ref=e252]:
                                - generic [ref=e253]: AsyncStorage
                                - 'generic "Nivel: expert" [ref=e254]': expert
                            - listitem [ref=e255]:
                                - generic [ref=e256]: MongoDB
                                - 'generic "Nivel: intermediate" [ref=e257]': intermediate
                    - generic [ref=e258]:
                        - heading "Internationalization" [level=2] [ref=e259]
                        - list "Internationalization habilidades" [ref=e260]:
                            - listitem [ref=e261]:
                                - generic [ref=e262]: i18next
                                - 'generic "Nivel: advanced" [ref=e263]': advanced
                            - listitem [ref=e264]:
                                - generic [ref=e265]: Localização de Apps
                                - 'generic "Nivel: advanced" [ref=e266]': advanced
                    - generic [ref=e267]:
                        - heading "Native Modules & Integrations" [level=2] [ref=e268]
                        - list "Native Modules & Integrations habilidades" [ref=e269]:
                            - listitem [ref=e270]:
                                - generic [ref=e271]: Expo Modules
                                - 'generic "Nivel: intermediate" [ref=e272]': intermediate
                            - listitem [ref=e273]:
                                - generic [ref=e274]: Daon (Biometria)
                                - 'generic "Nivel: intermediate" [ref=e275]': intermediate
                            - listitem [ref=e276]:
                                - generic [ref=e277]: Qualtrics
                                - 'generic "Nivel: intermediate" [ref=e278]': intermediate
                    - generic [ref=e279]:
                        - heading "Database & Storage" [level=2] [ref=e280]
                        - list "Database & Storage habilidades" [ref=e281]:
                            - listitem [ref=e282]:
                                - generic [ref=e283]: SQFlite
                                - 'generic "Nivel: intermediate" [ref=e284]': intermediate
                            - listitem [ref=e285]:
                                - generic [ref=e286]: AsyncStorage
                                - 'generic "Nivel: expert" [ref=e287]': expert
                            - listitem [ref=e288]:
                                - generic [ref=e289]: MongoDB
                                - 'generic "Nivel: intermediate" [ref=e290]': intermediate
                    - generic [ref=e291]:
                        - heading "Maps & Location" [level=2] [ref=e292]
                        - list "Maps & Location habilidades" [ref=e293]:
                            - listitem [ref=e294]:
                                - generic [ref=e295]: OpenStreetMaps
                                - 'generic "Nivel: intermediate" [ref=e296]': intermediate
                            - listitem [ref=e297]:
                                - generic [ref=e298]: GNSS/GPS
                                - 'generic "Nivel: expert" [ref=e299]': expert
                            - listitem [ref=e300]:
                                - generic [ref=e301]: Geolocalização
                                - 'generic "Nivel: advanced" [ref=e302]': advanced
                    - generic [ref=e303]:
                        - heading "DevOps & CI/CD" [level=2] [ref=e304]
                        - list "DevOps & CI/CD habilidades" [ref=e305]:
                            - listitem [ref=e306]:
                                - generic [ref=e307]: Google Play Console
                                - 'generic "Nivel: advanced" [ref=e308]': advanced
                            - listitem [ref=e309]:
                                - generic [ref=e310]: Apple Developer
                                - 'generic "Nivel: advanced" [ref=e311]': advanced
                            - listitem [ref=e312]:
                                - generic [ref=e313]: TestFlight
                                - 'generic "Nivel: advanced" [ref=e314]': advanced
                            - listitem [ref=e315]:
                                - generic [ref=e316]: Jenkins
                                - 'generic "Nivel: intermediate" [ref=e317]': intermediate
                            - listitem [ref=e318]:
                                - generic [ref=e319]: Fastlane
                                - 'generic "Nivel: intermediate" [ref=e320]': intermediate
                            - listitem [ref=e321]:
                                - generic [ref=e322]: Git/GitHub/GitLab
                                - 'generic "Nivel: expert" [ref=e323]': expert
                    - generic [ref=e324]:
                        - heading "Monitoring & Analytics" [level=2] [ref=e325]
                        - list "Monitoring & Analytics habilidades" [ref=e326]:
                            - listitem [ref=e327]:
                                - generic [ref=e328]: Elastic
                                - 'generic "Nivel: intermediate" [ref=e329]': intermediate
                            - listitem [ref=e330]:
                                - generic [ref=e331]: Kibana
                                - 'generic "Nivel: intermediate" [ref=e332]': intermediate
                            - listitem [ref=e333]:
                                - generic [ref=e334]: Grafana
                                - 'generic "Nivel: intermediate" [ref=e335]': intermediate
                    - generic [ref=e336]:
                        - heading "Project Management" [level=2] [ref=e337]
                        - list "Project Management habilidades" [ref=e338]:
                            - listitem [ref=e339]:
                                - generic [ref=e340]: Jira
                                - 'generic "Nivel: advanced" [ref=e341]': advanced
                            - listitem [ref=e342]:
                                - generic [ref=e343]: Confluence
                                - 'generic "Nivel: intermediate" [ref=e344]': intermediate
                            - listitem [ref=e345]:
                                - generic [ref=e346]: Metodologias Ágeis
                                - 'generic "Nivel: advanced" [ref=e347]': advanced
                    - generic [ref=e348]:
                        - heading "Backend & Desktop" [level=2] [ref=e349]
                        - list "Backend & Desktop habilidades" [ref=e350]:
                            - listitem [ref=e351]:
                                - generic [ref=e352]: Java
                                - 'generic "Nivel: advanced" [ref=e353]': advanced
                            - listitem [ref=e354]:
                                - generic [ref=e355]: Java Swing
                                - 'generic "Nivel: intermediate" [ref=e356]': intermediate
                            - listitem [ref=e357]:
                                - generic [ref=e358]: Python
                                - 'generic "Nivel: intermediate" [ref=e359]': intermediate
                            - listitem [ref=e360]:
                                - generic [ref=e361]: C++
                                - 'generic "Nivel: intermediate" [ref=e362]': intermediate
                    - generic [ref=e363]:
                        - heading "Domain Knowledge" [level=2] [ref=e364]
                        - list "Domain Knowledge habilidades" [ref=e365]:
                            - listitem [ref=e366]:
                                - generic [ref=e367]: Sistema Pix (DICT)
                                - 'generic "Nivel: expert" [ref=e368]': expert
                            - listitem [ref=e369]:
                                - generic [ref=e370]: Aplicações Bancárias
                                - 'generic "Nivel: expert" [ref=e371]': expert
                            - listitem [ref=e372]:
                                - generic [ref=e373]: Biometria e Autenticação
                                - 'generic "Nivel: advanced" [ref=e374]': advanced
                            - listitem [ref=e375]:
                                - generic [ref=e376]: Processamento de Imagens
                                - 'generic "Nivel: intermediate" [ref=e377]': intermediate
                            - listitem [ref=e378]:
                                - generic [ref=e379]: Ciências Cartográficas
                                - 'generic "Nivel: advanced" [ref=e380]': advanced
                    - generic [ref=e381]:
                        - heading "Languages" [level=2] [ref=e382]
                        - list "Languages habilidades" [ref=e383]:
                            - listitem [ref=e384]:
                                - generic [ref=e385]: Português (Nativo)
                                - 'generic "Nivel: expert" [ref=e386]': expert
                            - listitem [ref=e387]:
                                - generic [ref=e388]: Inglês (Intermediário-Avançado B2)
                                - 'generic "Nivel: advanced" [ref=e389]': advanced
                    - generic [ref=e390]:
                        - heading "Soft Skills" [level=2] [ref=e391]
                        - list "Soft Skills habilidades" [ref=e392]:
                            - listitem [ref=e393]:
                                - generic [ref=e394]: Comunicação com Stakeholders
                                - 'generic "Nivel: expert" [ref=e395]': expert
                            - listitem [ref=e396]:
                                - generic [ref=e397]: Orientação de Desenvolvedores
                                - 'generic "Nivel: advanced" [ref=e398]': advanced
                            - listitem [ref=e399]:
                                - generic [ref=e400]: Trabalho em Equipe
                                - 'generic "Nivel: expert" [ref=e401]': expert
                            - listitem [ref=e402]:
                                - generic [ref=e403]: Resolução de Problemas
                                - 'generic "Nivel: expert" [ref=e404]': expert
                            - listitem [ref=e405]:
                                - generic [ref=e406]: Metodologias Ágeis
                                - 'generic "Nivel: advanced" [ref=e407]': advanced
        - region "Proyectos" [ref=e409]:
            - generic [ref=e410]:
                - heading "Proyectos" [level=2] [ref=e411]
                - group "Filtrar por tecnología" [ref=e412]:
                    - button "Todos" [pressed] [ref=e413] [cursor=pointer]
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
                    - button "Ver detalles de Personal Resume Website" [ref=e435] [cursor=pointer]:
                        - img "Personal Resume Website captura de pantalla 1" [ref=e437]
                        - generic [ref=e438]:
                            - heading "Personal Resume Website" [level=3] [ref=e439]
                            - generic [ref=e441]: Destacado
                        - paragraph [ref=e442]: Site de currículo pessoal moderno e responsivo com suporte multilíngue, modo escuro, e integração completa com Firebase Analytics
                        - generic [ref=e443]:
                            - generic [ref=e444]: Next.js 16
                            - generic [ref=e445]: TypeScript
                            - generic [ref=e446]: Tailwind CSS
                            - generic [ref=e447]: Firebase Analytics
                            - generic [ref=e448]: +6 más
                    - button "Ver detalles de Android Native Crud" [ref=e450] [cursor=pointer]:
                        - img "Android Native Crud captura de pantalla 1" [ref=e452]
                        - heading "Android Native Crud" [level=3] [ref=e454]
                        - paragraph [ref=e455]: Aplicação de exemplo para estudo inicial do ambiente Android, explorando componentes fundamentais e padrões de desenvolvimento
                        - generic [ref=e456]:
                            - generic [ref=e457]: Java
                            - generic [ref=e458]: Android SDK
                            - generic [ref=e459]: Material Design
                            - generic [ref=e460]: SQLite
                            - generic [ref=e461]: +1 más
                    - button "Ver detalles de INCT GNSS App" [ref=e463] [cursor=pointer]:
                        - img "INCT GNSS App captura de pantalla 1" [ref=e465]
                        - generic [ref=e466]:
                            - heading "INCT GNSS App" [level=3] [ref=e467]
                            - generic [ref=e469]: Destacado
                        - paragraph [ref=e470]: Aplicação Android para análise de dados GNSS (GPS) coletados pelo Google GNSSLogger, com processamento de medições NMEA
                        - generic [ref=e471]:
                            - generic [ref=e472]: Java
                            - generic [ref=e473]: Android SDK
                            - generic [ref=e474]: GNSS/GPS
                            - generic [ref=e475]: NMEA Protocol
                            - generic [ref=e476]: +2 más
        - region "Ponte en Contacto" [ref=e477]:
            - generic [ref=e478]:
                - heading "Ponte en Contacto" [level=2] [ref=e479]
                - paragraph [ref=e480]: ¿Tienes un proyecto en mente o quieres charlar? ¡Envíame un mensaje!
                - generic [ref=e482]:
                    - img [ref=e483]
                    - generic [ref=e486]:
                        - paragraph [ref=e487]: Correo Profesional
                        - link "contact@rogeriodocarmo.com" [ref=e488]:
                            - /url: mailto:contact@rogeriodocarmo.com
                        - paragraph [ref=e489]: O usa el formulario a continuación para enviarme un mensaje
                - form "Formulario de contacto" [ref=e490]:
                    - generic [ref=e491]:
                        - generic [ref=e492]: Nombre *
                        - textbox "Nombre" [ref=e493]:
                            - /placeholder: Tu nombre
                    - generic [ref=e494]:
                        - generic [ref=e495]: Correo electrónico *
                        - textbox "Correo electrónico" [ref=e496]:
                            - /placeholder: tu@email.com
                    - generic [ref=e497]:
                        - generic [ref=e498]: Mensaje *
                        - textbox "Mensaje" [ref=e499]:
                            - /placeholder: Tu mensaje (al menos 10 caracteres)
                    - button "Enviar Mensaje" [ref=e500] [cursor=pointer]
    - contentinfo [ref=e501]:
        - generic [ref=e502]:
            - generic [ref=e503]:
                - generic [ref=e504]:
                    - heading "Navegar" [level=2] [ref=e505]
                    - list [ref=e506]:
                        - listitem [ref=e507]:
                            - link "Inicio" [ref=e508]:
                                - /url: "#home"
                        - listitem [ref=e509]:
                            - link "Proyectos" [ref=e510]:
                                - /url: "#projects"
                        - listitem [ref=e511]:
                            - link "Experiencia" [ref=e512]:
                                - /url: "#experience"
                        - listitem [ref=e513]:
                            - link "Habilidades" [ref=e514]:
                                - /url: "#skills"
                        - listitem [ref=e515]:
                            - link "Contacto" [ref=e516]:
                                - /url: "#contact"
                        - listitem [ref=e517]:
                            - link "Usado en este sitio" [ref=e518]:
                                - /url: "#tech-stack"
                - generic [ref=e519]:
                    - heading "Idiomas" [level=2] [ref=e520]
                    - list [ref=e521]:
                        - listitem [ref=e522]:
                            - link "Português (pt-BR)" [ref=e523]:
                                - /url: /pt-BR
                        - listitem [ref=e524]:
                            - link "English (en)" [ref=e525]:
                                - /url: /en
                        - listitem [ref=e526]:
                            - link "Español (es)" [ref=e527]:
                                - /url: /es
                - generic [ref=e528]:
                    - heading "Conectar" [level=2] [ref=e529]
                    - list [ref=e530]:
                        - listitem [ref=e531]:
                            - link "Correo Profesional" [ref=e532]:
                                - /url: mailto:contact@rogeriodocarmo.com
                                - img [ref=e533]
                                - generic [ref=e536]: contact@rogeriodocarmo.com
                        - listitem [ref=e537]:
                            - link "Descargar currículum en formato PDF" [ref=e538]:
                                - /url: /resumes/resume.pdf
                                - img [ref=e539]
                                - generic [ref=e541]: Descargar Currículum
                        - listitem [ref=e542]:
                            - link "Descargar disertación de maestría en formato PDF" [ref=e543]:
                                - /url: /academic/masters_degree_dissertation_rogerio_do_carmo.pdf
                                - img [ref=e544]
                                - generic [ref=e546]: Descargar Disertación
                        - listitem [ref=e547]:
                            - link "Linktree profile" [ref=e548]:
                                - /url: https://linktr.ee/rogeriodocarmo
                                - img [ref=e549]
                                - generic [ref=e551]: Linktree
                        - listitem [ref=e552]:
                            - link "LinkedIn profile" [ref=e553]:
                                - /url: https://www.linkedin.com/in/rogeriodocarmo/
                                - img [ref=e554]
                                - generic [ref=e556]: LinkedIn
                        - listitem [ref=e557]:
                            - link "GitHub profile" [ref=e558]:
                                - /url: https://github.com/RogerioDoCarmo/curriculo
                                - img [ref=e559]
                                - generic [ref=e561]: GitHub
                        - listitem [ref=e562]:
                            - button "Imprimir página del sitio" [ref=e563] [cursor=pointer]:
                                - img [ref=e564]
                                - generic [ref=e568]: Imprimir Página
            - paragraph [ref=e570]: © 2026 Rogério do Carmo. Todos los derechos reservados.
    - alert [ref=e571]
    - dialog "Este sitio usa cookies" [ref=e572]:
        - generic [ref=e573]:
            - heading "Este sitio usa cookies" [level=2] [ref=e574]
            - paragraph [ref=e575]: Usamos cookies esenciales para el funcionamiento del sitio y cookies de análisis para entender cómo interactúas con nuestro contenido. Todos los datos de análisis son anónimos y no incluyen información personal.
            - generic [ref=e576]:
                - generic [ref=e577]:
                    - img [ref=e579]
                    - generic [ref=e581]:
                        - paragraph [ref=e582]: Cookies Esenciales
                        - paragraph [ref=e583]: Necesarias para el funcionamiento básico del sitio (tema, idioma, sesión). Siempre activas.
                - generic [ref=e584]:
                    - img [ref=e586]
                    - generic [ref=e588]:
                        - paragraph [ref=e589]: Cookies de Análisis
                        - paragraph [ref=e590]: Ayudan a entender cómo los visitantes interactúan con el sitio a través de Firebase Analytics. Datos anónimos.
            - generic [ref=e591]:
                - button "Aceptar Todas" [ref=e592] [cursor=pointer]
                - button "Rechazar No-Esenciales" [ref=e593] [cursor=pointer]
                - button "Personalizar" [ref=e594] [cursor=pointer]
            - paragraph [ref=e595]:
                - text: Más información en nuestra
                - link "Política de Privacidad" [ref=e596]:
                    - /url: /privacy
                - text: "y"
                - link "Política de Cookies" [ref=e597]:
                    - /url: /cookies
```

# Test source

```ts
  326 |         const prefs = JSON.parse(localStorage.getItem("cookie-preferences") || "{}");
  327 |         return status === "accepted" || (status === "customized" && prefs.analytics === true);
  328 |       });
  329 |       expect(hasAnalyticsConsent).toBe(false);
  330 |     });
  331 |
  332 |     test("should return to main view when back button clicked", async ({ page }) => {
  333 |       await page.goto("/");
  334 |
  335 |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  336 |       await banner.getByRole("button", { name: /personalizar|customize/i }).click();
  337 |
  338 |       // Verify we're in customize view
  339 |       await expect(banner.getByText(/personalizar|customize preferences/i)).toBeVisible();
  340 |
  341 |       // Click back button
  342 |       await banner.getByRole("button", { name: /voltar|back/i }).click();
  343 |
  344 |       // Verify we're back in main view
  345 |       await expect(banner.getByRole("button", { name: /aceitar|accept/i })).toBeVisible();
  346 |       await expect(banner.getByRole("button", { name: /rejeitar|reject/i })).toBeVisible();
  347 |       await expect(banner.getByRole("button", { name: /personalizar|customize/i })).toBeVisible();
  348 |     });
  349 |   });
  350 |
  351 |   test.describe("Change preferences", () => {
  352 |     test("should reopen banner from footer link", async ({ page }) => {
  353 |       await page.goto("/");
  354 |
  355 |       // Accept cookies first
  356 |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  357 |       await banner.getByRole("button", { name: /aceitar|accept/i }).click();
  358 |       await page.waitForLoadState("networkidle");
  359 |
  360 |       // Banner should be hidden
  361 |       await expect(banner).not.toBeVisible();
  362 |
  363 |       // Find and click cookie settings link in footer
  364 |       const cookieSettingsLink = page.getByRole("link", {
  365 |         name: /configurações de cookies|cookie settings/i,
  366 |       });
  367 |       await cookieSettingsLink.click();
  368 |
  369 |       // Banner should reappear
  370 |       await expect(banner).toBeVisible();
  371 |     });
  372 |
  373 |     test("should allow changing existing consent", async ({ page }) => {
  374 |       await page.goto("/");
  375 |
  376 |       // Accept cookies first
  377 |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  378 |       await banner.getByRole("button", { name: /aceitar|accept/i }).click();
  379 |       await page.waitForLoadState("networkidle");
  380 |
  381 |       // Reopen banner
  382 |       await page.getByRole("link", { name: /configurações de cookies|cookie settings/i }).click();
  383 |       await expect(banner).toBeVisible();
  384 |
  385 |       // Change to reject
  386 |       await banner.getByRole("button", { name: /rejeitar|reject/i }).click();
  387 |
  388 |       // Verify consent changed
  389 |       const consentStatus = await page.evaluate(() => localStorage.getItem("cookie-consent"));
  390 |       expect(consentStatus).toBe("rejected");
  391 |     });
  392 |   });
  393 |
  394 |   test.describe("Multi-language support", () => {
  395 |     test("should display banner in Portuguese", async ({ page }) => {
  396 |       await page.goto("/pt-BR");
  397 |
  398 |       const banner = page.getByRole("dialog");
  399 |       await expect(banner).toBeVisible();
  400 |
  401 |       // Check Portuguese text
  402 |       await expect(banner.getByText(/cookies/i)).toBeVisible();
  403 |       await expect(banner.getByRole("button", { name: /aceitar/i })).toBeVisible();
  404 |       await expect(banner.getByRole("button", { name: /rejeitar/i })).toBeVisible();
  405 |     });
  406 |
  407 |     test("should display banner in English", async ({ page }) => {
  408 |       await page.goto("/en");
  409 |
  410 |       const banner = page.getByRole("dialog");
  411 |       await expect(banner).toBeVisible();
  412 |
  413 |       // Check English text
  414 |       await expect(banner.getByText(/cookies/i)).toBeVisible();
  415 |       await expect(banner.getByRole("button", { name: /accept/i })).toBeVisible();
  416 |       await expect(banner.getByRole("button", { name: /reject/i })).toBeVisible();
  417 |     });
  418 |
  419 |     test("should display banner in Spanish", async ({ page }) => {
  420 |       await page.goto("/es");
  421 |
  422 |       const banner = page.getByRole("dialog");
  423 |       await expect(banner).toBeVisible();
  424 |
  425 |       // Check Spanish text
> 426 |       await expect(banner.getByText(/cookies/i)).toBeVisible();
      |                                                  ^ Error: expect(locator).toBeVisible() failed
  427 |       await expect(banner.getByRole("button", { name: /aceptar/i })).toBeVisible();
  428 |       await expect(banner.getByRole("button", { name: /rechazar/i })).toBeVisible();
  429 |     });
  430 |   });
  431 |
  432 |   test.describe("Accessibility", () => {
  433 |     test("should be keyboard navigable", async ({ page }) => {
  434 |       await page.goto("/");
  435 |
  436 |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  437 |       await expect(banner).toBeVisible();
  438 |
  439 |       // Tab to first button (Accept All)
  440 |       await page.keyboard.press("Tab");
  441 |       const acceptButton = banner.getByRole("button", { name: /aceitar|accept/i });
  442 |       await expect(acceptButton).toBeFocused();
  443 |
  444 |       // Tab to second button (Reject)
  445 |       await page.keyboard.press("Tab");
  446 |       const rejectButton = banner.getByRole("button", { name: /rejeitar|reject/i });
  447 |       await expect(rejectButton).toBeFocused();
  448 |
  449 |       // Tab to third button (Customize)
  450 |       await page.keyboard.press("Tab");
  451 |       const customizeButton = banner.getByRole("button", { name: /personalizar|customize/i });
  452 |       await expect(customizeButton).toBeFocused();
  453 |
  454 |       // Press Enter to activate Customize
  455 |       await page.keyboard.press("Enter");
  456 |       await expect(banner.getByText(/personalizar|customize preferences/i)).toBeVisible();
  457 |     });
  458 |
  459 |     test("should have proper ARIA labels", async ({ page }) => {
  460 |       await page.goto("/");
  461 |
  462 |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  463 |       await expect(banner).toBeVisible();
  464 |
  465 |       // Check ARIA attributes
  466 |       await expect(banner).toHaveAttribute("role", "dialog");
  467 |       await expect(banner).toHaveAttribute("aria-modal", "true");
  468 |
  469 |       // Go to customize view
  470 |       await banner.getByRole("button", { name: /personalizar|customize/i }).click();
  471 |
  472 |       // Check checkboxes have labels
  473 |       const analyticsCheckbox = banner.getByRole("checkbox", { name: /analíticos|analytics/i });
  474 |       await expect(analyticsCheckbox).toHaveAttribute("aria-label");
  475 |     });
  476 |
  477 |     test("should trap focus in modal", async ({ page }) => {
  478 |       await page.goto("/");
  479 |
  480 |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  481 |       await expect(banner).toBeVisible();
  482 |
  483 |       // Tab through all focusable elements
  484 |       await page.keyboard.press("Tab"); // Accept button
  485 |       await page.keyboard.press("Tab"); // Reject button
  486 |       await page.keyboard.press("Tab"); // Customize button
  487 |       await page.keyboard.press("Tab"); // Should wrap back to Accept button
  488 |
  489 |       const acceptButton = banner.getByRole("button", { name: /aceitar|accept/i });
  490 |       await expect(acceptButton).toBeFocused();
  491 |     });
  492 |   });
  493 | });
  494 |
```
