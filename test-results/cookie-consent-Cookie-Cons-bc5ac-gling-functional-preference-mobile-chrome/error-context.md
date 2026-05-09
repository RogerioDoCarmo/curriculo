# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cookie-consent.spec.ts >> Cookie Consent Banner >> Customize flow >> should allow toggling functional preference
- Location: tests/e2e/cookie-consent.spec.ts:236:9

# Error details

```
Error: expect(locator).toBeChecked() failed

Locator: getByRole('dialog', { name: /cookies|privacidade/i }).getByRole('checkbox', { name: /funcionais|functional/i })
Expected: checked
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeChecked" with timeout 5000ms
  - waiting for getByRole('dialog', { name: /cookies|privacidade/i }).getByRole('checkbox', { name: /funcionais|functional/i })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
    - alert [ref=e2]: Rogério do Carmo | Desenvolvedor React Native Mobile
    - banner [ref=e3]:
        - generic [ref=e5]:
            - button "Open menu" [ref=e6] [cursor=pointer]
            - generic [ref=e11]:
                - link "Linktree profile" [ref=e12] [cursor=pointer]:
                    - /url: https://linktr.ee/rogeriodocarmo
                    - img [ref=e13]
                - generic [ref=e15]:
                    - generic [ref=e16]: Select language
                    - generic [ref=e17]: 🇧🇷
                    - combobox "Select language" [ref=e18] [cursor=pointer]:
                        - option "🇧🇷 Português (BR)" [selected]
                        - option "🇺🇸 English"
                        - option "🇪🇸 Español"
                    - generic: ▾
                - button "Switch to dark mode" [ref=e19] [cursor=pointer]:
                    - img "Moon" [ref=e20]: 🌙
    - main [ref=e21]:
        - region "Hero section" [ref=e23]:
            - generic [ref=e24]:
                - generic [ref=e25]:
                    - paragraph [ref=e26]: Olá, eu sou
                    - heading "Rogério do Carmo" [level=1] [ref=e27]
                    - paragraph [ref=e28]: Desenvolvedor Frontend Mobile React Native
                    - generic [ref=e29]:
                        - img "UNESP Logo" [ref=e30]
                        - generic [ref=e31]:
                            - paragraph [ref=e32]: Bacharel em Ciência da Computação
                            - paragraph [ref=e33]: Mestre em Ciências Cartográficas
                            - paragraph [ref=e34]: UNESP
                    - generic [ref=e35]:
                        - paragraph [ref=e36]: Dissertação de mestrado completa
                        - link "Avaliação da qualidade das medidas e posicionamento GNSS em smartphones Android" [ref=e38] [cursor=pointer]:
                            - /url: http://hdl.handle.net/11449/243430
                            - img [ref=e39]
                            - text: Avaliação da qualidade das medidas e posicionamento GNSS em smartphones Android
                        - link "Baixar dissertação de mestrado em PDF" [ref=e44] [cursor=pointer]:
                            - /url: /academic/masters_degree_dissertation_rogerio_do_carmo.pdf
                            - img [ref=e45]
                            - generic [ref=e47]: Baixar Dissertação (PDF)
                    - generic [ref=e48]:
                        - img "Company Logo" [ref=e49]
                        - generic [ref=e50]:
                            - paragraph [ref=e51]: Desenvolvedor Mobile Sênior
                            - paragraph [ref=e52]: Atual
                    - generic [ref=e53]:
                        - link "Ver Meu Trabalho" [ref=e54] [cursor=pointer]:
                            - /url: "#projects"
                        - link "Entre em Contato" [ref=e55] [cursor=pointer]:
                            - /url: mailto:contato@rogeriodocarmo.com
                            - img [ref=e56]
                            - text: Entre em Contato
                    - paragraph [ref=e59]:
                        - link "contato@rogeriodocarmo.com" [ref=e60] [cursor=pointer]:
                            - /url: mailto:contato@rogeriodocarmo.com
                - img "Rogério do Carmo — Mobile React Native Developer" [ref=e63]
        - tablist "Escolha um Caminho" [ref=e66]:
            - generic [ref=e67]:
                - tab "Profissional" [selected] [ref=e68] [cursor=pointer]:
                    - img [ref=e69]
                    - text: Profissional
                - tab "Acadêmico" [ref=e71] [cursor=pointer]:
                    - img [ref=e72]
                    - text: Acadêmico
        - region "Experiência Profissional experiência" [ref=e77]:
            - generic [ref=e78]:
                - heading "Experiência Profissional" [level=2] [ref=e79]
                - generic [ref=e80]:
                    - article [ref=e81]:
                        - generic [ref=e82]:
                            - generic [ref=e83]:
                                - heading "Desenvolvedor Mobile React Native" [level=3] [ref=e84]
                                - paragraph [ref=e85]: Topaz · Remoto, Brasil
                                - paragraph [ref=e86]: Feb 2023 – Presente · 3 yrs 3 mo
                            - button "Expandir detalhes" [ref=e87] [cursor=pointer]:
                                - img [ref=e88]
                        - paragraph [ref=e90]: "Atuação no produto interno da empresa, voltado ao setor bancário. Desenvolvimento e manutenção de aplicativos móveis para instituições financeiras, com foco em funcionalidades críticas e experiência do usuário. ### Conquistas - Desenvolveu e implementou módulo Pix completo para aplicativos bancários, incluindo integração com DICT (Diretório de Identificadores de Contas Transacionais) - Implementou Login Biométrico com integração Daon para autenticação segura - Criou módulo de Empréstimo com fluxo completo de solicitação e aprovação - Prestou manutenção e correção de bugs em aplicativos bancários críticos - Atuou em projetos para clientes específicos: CrediSIS (Brasil), Bradescard (México), Banco Macro (Argentina) e Banco do Nordeste - BNB (Brasil) - Trabalhou com Google Play Console, Apple Developer e TestFlight para distribuição de apps - Implementou testes unitários com Jest para garantir qualidade do código - Utilizou ferramentas de monitoramento (Elastic, Kibana, Grafana) para análise de performance - Experiência com metodologias ágeis e comunicação eficiente com stakeholders (POs, BAs, QAs, SMs) - Orientação de desenvolvedores júnior em boas práticas de desenvolvimento React Native"
                    - article [ref=e91]:
                        - generic [ref=e92]:
                            - generic [ref=e93]:
                                - heading "Desenvolvedor Flutter" [level=3] [ref=e94]
                                - paragraph [ref=e95]: Rubcube · Remoto, Brasil
                                - paragraph [ref=e96]: Oct 2021 – Jan 2022 · 3 mo
                            - button "Expandir detalhes" [ref=e97] [cursor=pointer]:
                                - img [ref=e98]
                        - paragraph [ref=e100]: "Atuação no aplicativo móvel do cliente Virtus Pay, focando em manutenção e qualidade do código. ### Conquistas - Efetuou manutenção e correções de bugs no aplicativo Virtus Pay - Trabalhou com Flutter para desenvolvimento multiplataforma - Experiência com aplicativos de pagamento digital"
                    - article [ref=e101]:
                        - generic [ref=e102]:
                            - generic [ref=e103]:
                                - heading "Desenvolvedor Mobile React Native" [level=3] [ref=e104]
                                - paragraph [ref=e105]: Rubcube · Remoto, Brasil
                                - paragraph [ref=e106]: Jan 2022 – Mar 2023 · 1 yr 2 mo
                            - button "Expandir detalhes" [ref=e107] [cursor=pointer]:
                                - img [ref=e108]
                        - paragraph [ref=e110]: "Atuação no desenvolvimento do aplicativo móvel do cliente Banco Digi+, com foco em funcionalidades bancárias e experiência do usuário. ### Conquistas - Criou módulo Pix completo do zero para o Banco Digi+, incluindo todas as funcionalidades de transferência e pagamento - Efetuou manutenção e correções de bugs no aplicativo bancário - Trabalhou com MongoDB para persistência de dados - Desenvolveu componentes React Native em formato funcional e de classes - Desenvolveu website da empresa utilizando React JS - Experiência com integração de APIs REST para serviços bancários"
                    - article [ref=e111]:
                        - generic [ref=e112]:
                            - generic [ref=e113]:
                                - heading "Desenvolvedor Android/Flutter" [level=3] [ref=e114]
                                - paragraph [ref=e115]: Engeselt · Remoto, Brasil
                                - paragraph [ref=e116]: Apr 2021 – Oct 2021 · 6 mo
                            - button "Expandir detalhes" [ref=e117] [cursor=pointer]:
                                - img [ref=e118]
                        - paragraph [ref=e120]: "Entrada na empresa para efetuar prova de conceito do mestrado sobre dados GNSS (GPS). Após conclusão, permaneceu na empresa para atuação em produtos próprios do setor elétrico. ### Conquistas - Desenvolveu prova de conceito utilizando dados GNSS (GPS) do mestrado - Efetuou manutenção e correções de bugs no aplicativo da empresa do setor elétrico - Trabalhou com Flutter MobX para gerenciamento de estado - Implementou funcionalidades offline-first com SQFlite e OpenStreetMaps - Desenvolveu em Android Nativo utilizando Java e XML - Aplicou conhecimentos acadêmicos de GNSS em aplicações práticas"
                - generic [ref=e122]:
                    - heading "Linha do Tempo" [level=3] [ref=e123]
                    - list "Timeline" [ref=e124]:
                        - listitem [ref=e126]:
                            - generic "Work" [ref=e127]:
                                - generic [ref=e128]: Work
                            - time [ref=e129]: Feb 2023 – Present · 3 yrs 3 mo
                            - generic [ref=e130]:
                                - heading "Desenvolvedor Mobile React Native" [level=3] [ref=e131]
                                - paragraph [ref=e132]: Topaz · Remoto, Brasil
                                - paragraph [ref=e133]: "Atuação no produto interno da empresa, voltado ao setor bancário. Desenvolvimento e manutenção de aplicativos móveis para instituições financeiras, com foco em funcionalidades críticas e experiência do usuário. ### Conquistas - Desenvolveu e implementou módulo Pix completo para aplicativos bancários, incluindo integração com DICT (Diretório de Identificadores de Contas Transacionais) - Implementou Login Biométrico com integração Daon para autenticação segura - Criou módulo de Empréstimo com fluxo completo de solicitação e aprovação - Prestou manutenção e correção de bugs em aplicativos bancários críticos - Atuou em projetos para clientes específicos: CrediSIS (Brasil), Bradescard (México), Banco Macro (Argentina) e Banco do Nordeste - BNB (Brasil) - Trabalhou com Google Play Console, Apple Developer e TestFlight para distribuição de apps - Implementou testes unitários com Jest para garantir qualidade do código - Utilizou ferramentas de monitoramento (Elastic, Kibana, Grafana) para análise de performance - Experiência com metodologias ágeis e comunicação eficiente com stakeholders (POs, BAs, QAs, SMs) - Orientação de desenvolvedores júnior em boas práticas de desenvolvimento React Native"
                        - listitem [ref=e134]:
                            - generic "Work" [ref=e135]:
                                - generic [ref=e136]: Work
                            - time [ref=e137]: Oct 2021 – Jan 2022 · 3 mo
                            - generic [ref=e138]:
                                - heading "Desenvolvedor Flutter" [level=3] [ref=e139]
                                - paragraph [ref=e140]: Rubcube · Remoto, Brasil
                                - paragraph [ref=e141]: "Atuação no aplicativo móvel do cliente Virtus Pay, focando em manutenção e qualidade do código. ### Conquistas - Efetuou manutenção e correções de bugs no aplicativo Virtus Pay - Trabalhou com Flutter para desenvolvimento multiplataforma - Experiência com aplicativos de pagamento digital"
                        - listitem [ref=e142]:
                            - generic "Work" [ref=e143]:
                                - generic [ref=e144]: Work
                            - time [ref=e145]: Jan 2022 – Mar 2023 · 1 yr 2 mo
                            - generic [ref=e146]:
                                - heading "Desenvolvedor Mobile React Native" [level=3] [ref=e147]
                                - paragraph [ref=e148]: Rubcube · Remoto, Brasil
                                - paragraph [ref=e149]: "Atuação no desenvolvimento do aplicativo móvel do cliente Banco Digi+, com foco em funcionalidades bancárias e experiência do usuário. ### Conquistas - Criou módulo Pix completo do zero para o Banco Digi+, incluindo todas as funcionalidades de transferência e pagamento - Efetuou manutenção e correções de bugs no aplicativo bancário - Trabalhou com MongoDB para persistência de dados - Desenvolveu componentes React Native em formato funcional e de classes - Desenvolveu website da empresa utilizando React JS - Experiência com integração de APIs REST para serviços bancários"
                        - listitem [ref=e150]:
                            - generic "Work" [ref=e151]:
                                - generic [ref=e152]: Work
                            - time [ref=e153]: Apr 2021 – Oct 2021 · 6 mo
                            - generic [ref=e154]:
                                - heading "Desenvolvedor Android/Flutter" [level=3] [ref=e155]
                                - paragraph [ref=e156]: Engeselt · Remoto, Brasil
                                - paragraph [ref=e157]: "Entrada na empresa para efetuar prova de conceito do mestrado sobre dados GNSS (GPS). Após conclusão, permaneceu na empresa para atuação em produtos próprios do setor elétrico. ### Conquistas - Desenvolveu prova de conceito utilizando dados GNSS (GPS) do mestrado - Efetuou manutenção e correções de bugs no aplicativo da empresa do setor elétrico - Trabalhou com Flutter MobX para gerenciamento de estado - Implementou funcionalidades offline-first com SQFlite e OpenStreetMaps - Desenvolveu em Android Nativo utilizando Java e XML - Aplicou conhecimentos acadêmicos de GNSS em aplicações práticas"
        - region "Habilidades" [ref=e159]:
            - generic [ref=e160]:
                - heading "Habilidades" [level=2] [ref=e161]
                - generic [ref=e162]:
                    - generic [ref=e163]: Filtrar habilidades
                    - searchbox "Filtrar habilidades por nome" [ref=e164]
                - generic [ref=e165]:
                    - generic [ref=e166]:
                        - heading "Mobile Development" [level=2] [ref=e167]
                        - list "Mobile Development habilidades" [ref=e168]:
                            - listitem [ref=e169]:
                                - generic [ref=e170]: React Native
                                - 'generic "Nível: expert" [ref=e171]': expert
                            - listitem [ref=e172]:
                                - generic [ref=e173]: Flutter
                                - 'generic "Nível: intermediate" [ref=e174]': intermediate
                            - listitem [ref=e175]:
                                - generic [ref=e176]: Android Nativo (Java)
                                - 'generic "Nível: advanced" [ref=e177]': advanced
                            - listitem [ref=e178]:
                                - generic [ref=e179]: TypeScript
                                - 'generic "Nível: advanced" [ref=e180]': advanced
                            - listitem [ref=e181]:
                                - generic [ref=e182]: JavaScript
                                - 'generic "Nível: expert" [ref=e183]': expert
                    - generic [ref=e184]:
                        - heading "State Management & Architecture" [level=2] [ref=e185]
                        - list "State Management & Architecture habilidades" [ref=e186]:
                            - listitem [ref=e187]:
                                - generic [ref=e188]: Redux/Saga
                                - 'generic "Nível: advanced" [ref=e189]': advanced
                            - listitem [ref=e190]:
                                - generic [ref=e191]: Jotai
                                - 'generic "Nível: intermediate" [ref=e192]': intermediate
                            - listitem [ref=e193]:
                                - generic [ref=e194]: TankStack
                                - 'generic "Nível: intermediate" [ref=e195]': intermediate
                            - listitem [ref=e196]:
                                - generic [ref=e197]: MobX
                                - 'generic "Nível: intermediate" [ref=e198]': intermediate
                    - generic [ref=e199]:
                        - heading "UI & Styling" [level=2] [ref=e200]
                        - list "UI & Styling habilidades" [ref=e201]:
                            - listitem [ref=e202]:
                                - generic [ref=e203]: React Native StyleSheet
                                - 'generic "Nível: expert" [ref=e204]': expert
                            - listitem [ref=e205]:
                                - generic [ref=e206]: Styled Components
                                - 'generic "Nível: advanced" [ref=e207]': advanced
                            - listitem [ref=e208]:
                                - generic [ref=e209]: React JS
                                - 'generic "Nível: advanced" [ref=e210]': advanced
                    - generic [ref=e211]:
                        - heading "Forms & Validation" [level=2] [ref=e212]
                        - list "Forms & Validation habilidades" [ref=e213]:
                            - listitem [ref=e214]:
                                - generic [ref=e215]: react-hook-form
                                - 'generic "Nível: advanced" [ref=e216]': advanced
                            - listitem [ref=e217]:
                                - generic [ref=e218]: Validação de Formulários
                                - 'generic "Nível: expert" [ref=e219]': expert
                    - generic [ref=e220]:
                        - heading "Testing" [level=2] [ref=e221]
                        - list "Testing habilidades" [ref=e222]:
                            - listitem [ref=e223]:
                                - generic [ref=e224]: Jest
                                - 'generic "Nível: advanced" [ref=e225]': advanced
                            - listitem [ref=e226]:
                                - generic [ref=e227]: Testes Unitários
                                - 'generic "Nível: advanced" [ref=e228]': advanced
                    - generic [ref=e229]:
                        - heading "Firebase & Cloud Services" [level=2] [ref=e230]
                        - list "Firebase & Cloud Services habilidades" [ref=e231]:
                            - listitem [ref=e232]:
                                - generic [ref=e233]: Firebase Analytics
                                - 'generic "Nível: advanced" [ref=e234]': advanced
                            - listitem [ref=e235]:
                                - generic [ref=e236]: Firebase Crashlytics
                                - 'generic "Nível: advanced" [ref=e237]': advanced
                            - listitem [ref=e238]:
                                - generic [ref=e239]: Firebase Distribution
                                - 'generic "Nível: intermediate" [ref=e240]': intermediate
                            - listitem [ref=e241]:
                                - generic [ref=e242]: Firebase Storage
                                - 'generic "Nível: intermediate" [ref=e243]': intermediate
                    - generic [ref=e244]:
                        - heading "APIs & Integration" [level=2] [ref=e245]
                        - list "APIs & Integration habilidades" [ref=e246]:
                            - listitem [ref=e247]:
                                - generic [ref=e248]: REST APIs
                                - 'generic "Nível: expert" [ref=e249]': expert
                            - listitem [ref=e250]:
                                - generic [ref=e251]: AsyncStorage
                                - 'generic "Nível: expert" [ref=e252]': expert
                            - listitem [ref=e253]:
                                - generic [ref=e254]: MongoDB
                                - 'generic "Nível: intermediate" [ref=e255]': intermediate
                    - generic [ref=e256]:
                        - heading "Internationalization" [level=2] [ref=e257]
                        - list "Internationalization habilidades" [ref=e258]:
                            - listitem [ref=e259]:
                                - generic [ref=e260]: i18next
                                - 'generic "Nível: advanced" [ref=e261]': advanced
                            - listitem [ref=e262]:
                                - generic [ref=e263]: Localização de Apps
                                - 'generic "Nível: advanced" [ref=e264]': advanced
                    - generic [ref=e265]:
                        - heading "Native Modules & Integrations" [level=2] [ref=e266]
                        - list "Native Modules & Integrations habilidades" [ref=e267]:
                            - listitem [ref=e268]:
                                - generic [ref=e269]: Expo Modules
                                - 'generic "Nível: intermediate" [ref=e270]': intermediate
                            - listitem [ref=e271]:
                                - generic [ref=e272]: Daon (Biometria)
                                - 'generic "Nível: intermediate" [ref=e273]': intermediate
                            - listitem [ref=e274]:
                                - generic [ref=e275]: Qualtrics
                                - 'generic "Nível: intermediate" [ref=e276]': intermediate
                    - generic [ref=e277]:
                        - heading "Database & Storage" [level=2] [ref=e278]
                        - list "Database & Storage habilidades" [ref=e279]:
                            - listitem [ref=e280]:
                                - generic [ref=e281]: SQFlite
                                - 'generic "Nível: intermediate" [ref=e282]': intermediate
                            - listitem [ref=e283]:
                                - generic [ref=e284]: AsyncStorage
                                - 'generic "Nível: expert" [ref=e285]': expert
                            - listitem [ref=e286]:
                                - generic [ref=e287]: MongoDB
                                - 'generic "Nível: intermediate" [ref=e288]': intermediate
                    - generic [ref=e289]:
                        - heading "Maps & Location" [level=2] [ref=e290]
                        - list "Maps & Location habilidades" [ref=e291]:
                            - listitem [ref=e292]:
                                - generic [ref=e293]: OpenStreetMaps
                                - 'generic "Nível: intermediate" [ref=e294]': intermediate
                            - listitem [ref=e295]:
                                - generic [ref=e296]: GNSS/GPS
                                - 'generic "Nível: expert" [ref=e297]': expert
                            - listitem [ref=e298]:
                                - generic [ref=e299]: Geolocalização
                                - 'generic "Nível: advanced" [ref=e300]': advanced
                    - generic [ref=e301]:
                        - heading "DevOps & CI/CD" [level=2] [ref=e302]
                        - list "DevOps & CI/CD habilidades" [ref=e303]:
                            - listitem [ref=e304]:
                                - generic [ref=e305]: Google Play Console
                                - 'generic "Nível: advanced" [ref=e306]': advanced
                            - listitem [ref=e307]:
                                - generic [ref=e308]: Apple Developer
                                - 'generic "Nível: advanced" [ref=e309]': advanced
                            - listitem [ref=e310]:
                                - generic [ref=e311]: TestFlight
                                - 'generic "Nível: advanced" [ref=e312]': advanced
                            - listitem [ref=e313]:
                                - generic [ref=e314]: Jenkins
                                - 'generic "Nível: intermediate" [ref=e315]': intermediate
                            - listitem [ref=e316]:
                                - generic [ref=e317]: Fastlane
                                - 'generic "Nível: intermediate" [ref=e318]': intermediate
                            - listitem [ref=e319]:
                                - generic [ref=e320]: Git/GitHub/GitLab
                                - 'generic "Nível: expert" [ref=e321]': expert
                    - generic [ref=e322]:
                        - heading "Monitoring & Analytics" [level=2] [ref=e323]
                        - list "Monitoring & Analytics habilidades" [ref=e324]:
                            - listitem [ref=e325]:
                                - generic [ref=e326]: Elastic
                                - 'generic "Nível: intermediate" [ref=e327]': intermediate
                            - listitem [ref=e328]:
                                - generic [ref=e329]: Kibana
                                - 'generic "Nível: intermediate" [ref=e330]': intermediate
                            - listitem [ref=e331]:
                                - generic [ref=e332]: Grafana
                                - 'generic "Nível: intermediate" [ref=e333]': intermediate
                    - generic [ref=e334]:
                        - heading "Project Management" [level=2] [ref=e335]
                        - list "Project Management habilidades" [ref=e336]:
                            - listitem [ref=e337]:
                                - generic [ref=e338]: Jira
                                - 'generic "Nível: advanced" [ref=e339]': advanced
                            - listitem [ref=e340]:
                                - generic [ref=e341]: Confluence
                                - 'generic "Nível: intermediate" [ref=e342]': intermediate
                            - listitem [ref=e343]:
                                - generic [ref=e344]: Metodologias Ágeis
                                - 'generic "Nível: advanced" [ref=e345]': advanced
                    - generic [ref=e346]:
                        - heading "Backend & Desktop" [level=2] [ref=e347]
                        - list "Backend & Desktop habilidades" [ref=e348]:
                            - listitem [ref=e349]:
                                - generic [ref=e350]: Java
                                - 'generic "Nível: advanced" [ref=e351]': advanced
                            - listitem [ref=e352]:
                                - generic [ref=e353]: Java Swing
                                - 'generic "Nível: intermediate" [ref=e354]': intermediate
                            - listitem [ref=e355]:
                                - generic [ref=e356]: Python
                                - 'generic "Nível: intermediate" [ref=e357]': intermediate
                            - listitem [ref=e358]:
                                - generic [ref=e359]: C++
                                - 'generic "Nível: intermediate" [ref=e360]': intermediate
                    - generic [ref=e361]:
                        - heading "Domain Knowledge" [level=2] [ref=e362]
                        - list "Domain Knowledge habilidades" [ref=e363]:
                            - listitem [ref=e364]:
                                - generic [ref=e365]: Sistema Pix (DICT)
                                - 'generic "Nível: expert" [ref=e366]': expert
                            - listitem [ref=e367]:
                                - generic [ref=e368]: Aplicações Bancárias
                                - 'generic "Nível: expert" [ref=e369]': expert
                            - listitem [ref=e370]:
                                - generic [ref=e371]: Biometria e Autenticação
                                - 'generic "Nível: advanced" [ref=e372]': advanced
                            - listitem [ref=e373]:
                                - generic [ref=e374]: Processamento de Imagens
                                - 'generic "Nível: intermediate" [ref=e375]': intermediate
                            - listitem [ref=e376]:
                                - generic [ref=e377]: Ciências Cartográficas
                                - 'generic "Nível: advanced" [ref=e378]': advanced
                    - generic [ref=e379]:
                        - heading "Languages" [level=2] [ref=e380]
                        - list "Languages habilidades" [ref=e381]:
                            - listitem [ref=e382]:
                                - generic [ref=e383]: Português (Nativo)
                                - 'generic "Nível: expert" [ref=e384]': expert
                            - listitem [ref=e385]:
                                - generic [ref=e386]: Inglês (Intermediário-Avançado B2)
                                - 'generic "Nível: advanced" [ref=e387]': advanced
                    - generic [ref=e388]:
                        - heading "Soft Skills" [level=2] [ref=e389]
                        - list "Soft Skills habilidades" [ref=e390]:
                            - listitem [ref=e391]:
                                - generic [ref=e392]: Comunicação com Stakeholders
                                - 'generic "Nível: expert" [ref=e393]': expert
                            - listitem [ref=e394]:
                                - generic [ref=e395]: Orientação de Desenvolvedores
                                - 'generic "Nível: advanced" [ref=e396]': advanced
                            - listitem [ref=e397]:
                                - generic [ref=e398]: Trabalho em Equipe
                                - 'generic "Nível: expert" [ref=e399]': expert
                            - listitem [ref=e400]:
                                - generic [ref=e401]: Resolução de Problemas
                                - 'generic "Nível: expert" [ref=e402]': expert
                            - listitem [ref=e403]:
                                - generic [ref=e404]: Metodologias Ágeis
                                - 'generic "Nível: advanced" [ref=e405]': advanced
        - region "Projetos" [ref=e407]:
            - generic [ref=e408]:
                - heading "Projetos" [level=2] [ref=e409]
                - group "Filtrar por tecnologia" [ref=e410]:
                    - button "Todas" [pressed] [ref=e411] [cursor=pointer]
                    - button "Android Architecture Components" [ref=e412] [cursor=pointer]
                    - button "Android SDK" [ref=e413] [cursor=pointer]
                    - button "Data Processing" [ref=e414] [cursor=pointer]
                    - button "Firebase Analytics" [ref=e415] [cursor=pointer]
                    - button "Firebase Crashlytics" [ref=e416] [cursor=pointer]
                    - button "GNSS/GPS" [ref=e417] [cursor=pointer]
                    - button "Java" [ref=e418] [cursor=pointer]
                    - button "Jest" [ref=e419] [cursor=pointer]
                    - button "Material Design" [ref=e420] [cursor=pointer]
                    - button "NMEA Protocol" [ref=e421] [cursor=pointer]
                    - button "Next.js 16" [ref=e422] [cursor=pointer]
                    - button "Playwright" [ref=e423] [cursor=pointer]
                    - button "SQLite" [ref=e424] [cursor=pointer]
                    - button "Scientific Computing" [ref=e425] [cursor=pointer]
                    - button "Sentry" [ref=e426] [cursor=pointer]
                    - button "Tailwind CSS" [ref=e427] [cursor=pointer]
                    - button "TypeScript" [ref=e428] [cursor=pointer]
                    - button "Vercel" [ref=e429] [cursor=pointer]
                    - button "next-intl" [ref=e430] [cursor=pointer]
                - generic [ref=e431]:
                    - button "Ver detalhes de Personal Resume Website" [ref=e433] [cursor=pointer]:
                        - img "Personal Resume Website captura de tela 1" [ref=e435]
                        - generic [ref=e436]:
                            - heading "Personal Resume Website" [level=3] [ref=e437]
                            - generic [ref=e439]: Destaque
                        - paragraph [ref=e440]: Site de currículo pessoal moderno e responsivo com suporte multilíngue, modo escuro, e integração completa com Firebase Analytics
                        - generic [ref=e441]:
                            - generic [ref=e442]: Next.js 16
                            - generic [ref=e443]: TypeScript
                            - generic [ref=e444]: Tailwind CSS
                            - generic [ref=e445]: Firebase Analytics
                            - generic [ref=e446]: +6 mais
                    - button "Ver detalhes de Android Native Crud" [ref=e448] [cursor=pointer]:
                        - img "Android Native Crud captura de tela 1" [ref=e450]
                        - heading "Android Native Crud" [level=3] [ref=e452]
                        - paragraph [ref=e453]: Aplicação de exemplo para estudo inicial do ambiente Android, explorando componentes fundamentais e padrões de desenvolvimento
                        - generic [ref=e454]:
                            - generic [ref=e455]: Java
                            - generic [ref=e456]: Android SDK
                            - generic [ref=e457]: Material Design
                            - generic [ref=e458]: SQLite
                            - generic [ref=e459]: +1 mais
                    - button "Ver detalhes de INCT GNSS App" [ref=e461] [cursor=pointer]:
                        - img "INCT GNSS App captura de tela 1" [ref=e463]
                        - generic [ref=e464]:
                            - heading "INCT GNSS App" [level=3] [ref=e465]
                            - generic [ref=e467]: Destaque
                        - paragraph [ref=e468]: Aplicação Android para análise de dados GNSS (GPS) coletados pelo Google GNSSLogger, com processamento de medições NMEA
                        - generic [ref=e469]:
                            - generic [ref=e470]: Java
                            - generic [ref=e471]: Android SDK
                            - generic [ref=e472]: GNSS/GPS
                            - generic [ref=e473]: NMEA Protocol
                            - generic [ref=e474]: +2 mais
        - region "Entre em Contato" [ref=e475]:
            - generic [ref=e476]:
                - heading "Entre em Contato" [level=2] [ref=e477]
                - paragraph [ref=e478]: Tem um projeto em mente ou quer conversar? Envie-me uma mensagem!
                - generic [ref=e480]:
                    - img [ref=e481]
                    - generic [ref=e484]:
                        - paragraph [ref=e485]: E-mail Profissional
                        - link "contato@rogeriodocarmo.com" [ref=e486] [cursor=pointer]:
                            - /url: mailto:contato@rogeriodocarmo.com
                        - paragraph [ref=e487]: Ou use o formulário abaixo para me enviar uma mensagem
                - form "Formulário de contato" [ref=e488]:
                    - generic [ref=e489]:
                        - generic [ref=e490]: Nome *
                        - textbox "Nome" [ref=e491]:
                            - /placeholder: Seu nome
                    - generic [ref=e492]:
                        - generic [ref=e493]: E-mail *
                        - textbox "E-mail" [ref=e494]:
                            - /placeholder: seu@email.com
                    - generic [ref=e495]:
                        - generic [ref=e496]: Mensagem *
                        - textbox "Mensagem" [ref=e497]:
                            - /placeholder: Sua mensagem (pelo menos 10 caracteres)
                    - button "Enviar Mensagem" [ref=e498] [cursor=pointer]
    - contentinfo [ref=e499]:
        - generic [ref=e500]:
            - generic [ref=e501]:
                - generic [ref=e502]:
                    - heading "Navegar" [level=2] [ref=e503]
                    - list [ref=e504]:
                        - listitem [ref=e505]:
                            - link "Início" [ref=e506] [cursor=pointer]:
                                - /url: "#home"
                        - listitem [ref=e507]:
                            - link "Projetos" [ref=e508] [cursor=pointer]:
                                - /url: "#projects"
                        - listitem [ref=e509]:
                            - link "Experiência" [ref=e510] [cursor=pointer]:
                                - /url: "#experience"
                        - listitem [ref=e511]:
                            - link "Habilidades" [ref=e512] [cursor=pointer]:
                                - /url: "#skills"
                        - listitem [ref=e513]:
                            - link "Contato" [ref=e514] [cursor=pointer]:
                                - /url: "#contact"
                        - listitem [ref=e515]:
                            - link "Usado neste site" [ref=e516] [cursor=pointer]:
                                - /url: "#tech-stack"
                - generic [ref=e517]:
                    - heading "Idiomas" [level=2] [ref=e518]
                    - list [ref=e519]:
                        - listitem [ref=e520]:
                            - link "Português (pt-BR)" [ref=e521] [cursor=pointer]:
                                - /url: /pt-BR
                        - listitem [ref=e522]:
                            - link "English (en)" [ref=e523] [cursor=pointer]:
                                - /url: /en
                        - listitem [ref=e524]:
                            - link "Español (es)" [ref=e525] [cursor=pointer]:
                                - /url: /es
                - generic [ref=e526]:
                    - heading "Conectar" [level=2] [ref=e527]
                    - list [ref=e528]:
                        - listitem [ref=e529]:
                            - link "E-mail Profissional" [ref=e530] [cursor=pointer]:
                                - /url: mailto:contato@rogeriodocarmo.com
                                - img [ref=e531]
                                - generic [ref=e534]: contato@rogeriodocarmo.com
                        - listitem [ref=e535]:
                            - link "Baixar currículo em formato PDF" [ref=e536] [cursor=pointer]:
                                - /url: /resumes/resume.pdf
                                - img [ref=e537]
                                - generic [ref=e539]: Baixar Currículo
                        - listitem [ref=e540]:
                            - link "Baixar dissertação de mestrado em formato PDF" [ref=e541] [cursor=pointer]:
                                - /url: /academic/masters_degree_dissertation_rogerio_do_carmo.pdf
                                - img [ref=e542]
                                - generic [ref=e544]: Baixar Dissertação
                        - listitem [ref=e545]:
                            - link "Linktree profile" [ref=e546] [cursor=pointer]:
                                - /url: https://linktr.ee/rogeriodocarmo
                                - img [ref=e547]
                                - generic [ref=e549]: Linktree
                        - listitem [ref=e550]:
                            - link "LinkedIn profile" [ref=e551] [cursor=pointer]:
                                - /url: https://www.linkedin.com/in/rogeriodocarmo/
                                - img [ref=e552]
                                - generic [ref=e554]: LinkedIn
                        - listitem [ref=e555]:
                            - link "GitHub profile" [ref=e556] [cursor=pointer]:
                                - /url: https://github.com/RogerioDoCarmo/curriculo
                                - img [ref=e557]
                                - generic [ref=e559]: GitHub
                        - listitem [ref=e560]:
                            - button "Imprimir página do site" [ref=e561] [cursor=pointer]:
                                - img [ref=e562]
                                - generic [ref=e566]: Imprimir Página
            - paragraph [ref=e568]: © 2026 Rogério do Carmo. Todos os direitos reservados.
    - dialog [ref=e569]:
        - generic [ref=e570]:
            - generic [ref=e571]:
                - button "Voltar" [ref=e572] [cursor=pointer]:
                    - img [ref=e573]
                - heading "Personalizar Preferências de Cookies" [level=2] [ref=e575]
            - paragraph [ref=e576]: Escolha quais categorias de cookies você deseja permitir. Cookies essenciais não podem ser desativados.
            - generic [ref=e577]:
                - generic [ref=e578]:
                    - generic [ref=e579]:
                        - generic [ref=e580]:
                            - heading "Cookies Essenciais" [level=3] [ref=e581]
                            - generic [ref=e582]: Obrigatório
                        - paragraph [ref=e583]: Necessários para o funcionamento básico do site (tema, idioma, sessão). Sempre ativos.
                    - checkbox "Cookies Essenciais" [checked] [disabled] [ref=e585]
                - generic [ref=e586]:
                    - generic [ref=e587]:
                        - heading "Cookies de Análise" [level=3] [ref=e588]
                        - paragraph [ref=e589]: Ajudam a entender como os visitantes interagem com o site através do Firebase Analytics. Dados anônimos.
                        - paragraph [ref=e590]: "Cookies: _ga, _ga_<container-id>, _gid, _gat"
                    - checkbox "Cookies de Análise" [ref=e592]
                - generic [ref=e593]:
                    - generic [ref=e594]:
                        - heading "Cookies Funcionais" [level=3] [ref=e595]
                        - paragraph [ref=e596]: Melhoram a experiência do usuário com recursos adicionais (notificações, preferências).
                    - checkbox "Cookies Funcionais" [ref=e598]
            - button "Salvar Preferências" [ref=e600] [cursor=pointer]
```

# Test source

```ts
  145 |
  146 |     test("should persist rejection across page reloads", async ({ page }) => {
  147 |       await page.goto("/");
  148 |
  149 |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  150 |       await banner.getByRole("button", { name: /rejeitar|reject/i }).click();
  151 |
  152 |       // Check localStorage
  153 |       const consentStatus = await page.evaluate(() => localStorage.getItem("cookie-consent"));
  154 |       expect(consentStatus).toBe("rejected");
  155 |
  156 |       const preferences = await page.evaluate(() =>
  157 |         JSON.parse(localStorage.getItem("cookie-preferences") || "{}")
  158 |       );
  159 |       expect(preferences.analytics).toBe(false);
  160 |       expect(preferences.functional).toBe(false);
  161 |
  162 |       // Reload page
  163 |       await page.reload();
  164 |
  165 |       // Banner should not be visible after reload
  166 |       await expect(banner).not.toBeVisible();
  167 |     });
  168 |
  169 |     test("should NOT enable Firebase Analytics after rejecting", async ({ page }) => {
  170 |       await page.goto("/");
  171 |
  172 |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  173 |       await banner.getByRole("button", { name: /rejeitar|reject/i }).click();
  174 |
  175 |       // Check that analytics consent is NOT granted
  176 |       const hasConsent = await page.evaluate(() => {
  177 |         const status = localStorage.getItem("cookie-consent");
  178 |         const prefs = JSON.parse(localStorage.getItem("cookie-preferences") || "{}");
  179 |         return status === "accepted" || (status === "customized" && prefs.analytics === true);
  180 |       });
  181 |       expect(hasConsent).toBe(false);
  182 |     });
  183 |   });
  184 |
  185 |   test.describe("Customize flow", () => {
  186 |     test("should show customize view when clicked", async ({ page }) => {
  187 |       await page.goto("/");
  188 |
  189 |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  190 |       await expect(banner).toBeVisible();
  191 |
  192 |       // Click Customize button
  193 |       await banner.getByRole("button", { name: /personalizar|customize/i }).click();
  194 |
  195 |       // Verify customize view is shown
  196 |       await expect(banner.getByText(/personalizar|customize preferences/i)).toBeVisible();
  197 |
  198 |       // Verify checkboxes are present
  199 |       await expect(banner.getByRole("checkbox", { name: /essenciais|essential/i })).toBeVisible();
  200 |       await expect(banner.getByRole("checkbox", { name: /analíticos|analytics/i })).toBeVisible();
  201 |       await expect(banner.getByRole("checkbox", { name: /funcionais|functional/i })).toBeVisible();
  202 |     });
  203 |
  204 |     test("should have essential cookies always enabled", async ({ page }) => {
  205 |       await page.goto("/");
  206 |
  207 |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  208 |       await banner.getByRole("button", { name: /personalizar|customize/i }).click();
  209 |
  210 |       // Essential checkbox should be checked and disabled
  211 |       const essentialCheckbox = banner.getByRole("checkbox", { name: /essenciais|essential/i });
  212 |       await expect(essentialCheckbox).toBeChecked();
  213 |       await expect(essentialCheckbox).toBeDisabled();
  214 |     });
  215 |
  216 |     test("should allow toggling analytics preference", async ({ page }) => {
  217 |       await page.goto("/");
  218 |
  219 |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  220 |       await banner.getByRole("button", { name: /personalizar|customize/i }).click();
  221 |
  222 |       const analyticsCheckbox = banner.getByRole("checkbox", { name: /analíticos|analytics/i });
  223 |
  224 |       // Should be checked by default
  225 |       await expect(analyticsCheckbox).toBeChecked();
  226 |
  227 |       // Uncheck analytics
  228 |       await analyticsCheckbox.click();
  229 |       await expect(analyticsCheckbox).not.toBeChecked();
  230 |
  231 |       // Check analytics again
  232 |       await analyticsCheckbox.click();
  233 |       await expect(analyticsCheckbox).toBeChecked();
  234 |     });
  235 |
  236 |     test("should allow toggling functional preference", async ({ page }) => {
  237 |       await page.goto("/");
  238 |
  239 |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  240 |       await banner.getByRole("button", { name: /personalizar|customize/i }).click();
  241 |
  242 |       const functionalCheckbox = banner.getByRole("checkbox", { name: /funcionais|functional/i });
  243 |
  244 |       // Should be checked by default
> 245 |       await expect(functionalCheckbox).toBeChecked();
      |                                        ^ Error: expect(locator).toBeChecked() failed
  246 |
  247 |       // Uncheck functional
  248 |       await functionalCheckbox.click();
  249 |       await expect(functionalCheckbox).not.toBeChecked();
  250 |
  251 |       // Check functional again
  252 |       await functionalCheckbox.click();
  253 |       await expect(functionalCheckbox).toBeChecked();
  254 |     });
  255 |
  256 |     test("should save custom preferences", async ({ page }) => {
  257 |       await page.goto("/");
  258 |
  259 |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  260 |       await banner.getByRole("button", { name: /personalizar|customize/i }).click();
  261 |
  262 |       // Disable analytics, keep functional enabled
  263 |       const analyticsCheckbox = banner.getByRole("checkbox", { name: /analíticos|analytics/i });
  264 |       await analyticsCheckbox.click(); // Uncheck
  265 |
  266 |       // Save preferences
  267 |       await banner.getByRole("button", { name: /salvar|save/i }).click();
  268 |
  269 |       // Wait for reload
  270 |       await page.waitForLoadState("networkidle");
  271 |
  272 |       // Check localStorage
  273 |       const consentStatus = await page.evaluate(() => localStorage.getItem("cookie-consent"));
  274 |       expect(consentStatus).toBe("customized");
  275 |
  276 |       const preferences = await page.evaluate(() =>
  277 |         JSON.parse(localStorage.getItem("cookie-preferences") || "{}")
  278 |       );
  279 |       expect(preferences.analytics).toBe(false);
  280 |       expect(preferences.functional).toBe(true);
  281 |     });
  282 |
  283 |     test("should persist custom preferences across reloads", async ({ page }) => {
  284 |       await page.goto("/");
  285 |
  286 |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  287 |       await banner.getByRole("button", { name: /personalizar|customize/i }).click();
  288 |
  289 |       // Enable only functional, disable analytics
  290 |       await banner.getByRole("checkbox", { name: /analíticos|analytics/i }).click();
  291 |       await banner.getByRole("button", { name: /salvar|save/i }).click();
  292 |
  293 |       // Wait for reload
  294 |       await page.waitForLoadState("networkidle");
  295 |
  296 |       // Reload page manually
  297 |       await page.reload();
  298 |
  299 |       // Banner should not be visible
  300 |       await expect(banner).not.toBeVisible();
  301 |
  302 |       // Verify preferences persisted
  303 |       const preferences = await page.evaluate(() =>
  304 |         JSON.parse(localStorage.getItem("cookie-preferences") || "{}")
  305 |       );
  306 |       expect(preferences.analytics).toBe(false);
  307 |       expect(preferences.functional).toBe(true);
  308 |     });
  309 |
  310 |     test("should respect analytics preference for tracking", async ({ page }) => {
  311 |       await page.goto("/");
  312 |
  313 |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  314 |       await banner.getByRole("button", { name: /personalizar|customize/i }).click();
  315 |
  316 |       // Disable analytics
  317 |       await banner.getByRole("checkbox", { name: /analíticos|analytics/i }).click();
  318 |       await banner.getByRole("button", { name: /salvar|save/i }).click();
  319 |
  320 |       // Wait for reload
  321 |       await page.waitForLoadState("networkidle");
  322 |
  323 |       // Verify analytics is disabled
  324 |       const hasAnalyticsConsent = await page.evaluate(() => {
  325 |         const status = localStorage.getItem("cookie-consent");
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
```
