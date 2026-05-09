# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cookie-consent.spec.ts >> Cookie Consent Banner >> Accessibility >> should be keyboard navigable
- Location: tests/e2e/cookie-consent.spec.ts:433:9

# Error details

```
Error: expect(locator).toBeFocused() failed

Locator:  getByRole('dialog', { name: /cookies|privacidade/i }).getByRole('button', { name: /aceitar|accept/i })
Expected: focused
Received: inactive
Timeout:  5000ms

Call log:
  - Expect "toBeFocused" with timeout 5000ms
  - waiting for getByRole('dialog', { name: /cookies|privacidade/i }).getByRole('button', { name: /aceitar|accept/i })
    8 × locator resolved to <button class="flex-1 rounded-md bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600">Aceitar Todos</button>
      - unexpected value "inactive"

```

# Page snapshot

```yaml
- generic [ref=e1]:
    - alert [ref=e2]: Rogério do Carmo | Desenvolvedor React Native Mobile
    - banner [ref=e3]:
        - generic [ref=e5]:
            - navigation "Main navigation" [ref=e6]:
                - link "Início" [active] [ref=e7] [cursor=pointer]:
                    - /url: "#home"
                - link "Projetos" [ref=e8] [cursor=pointer]:
                    - /url: "#projects"
                - link "Experiência" [ref=e9] [cursor=pointer]:
                    - /url: "#experience"
                - link "Habilidades" [ref=e10] [cursor=pointer]:
                    - /url: "#skills"
                - link "Contato" [ref=e11] [cursor=pointer]:
                    - /url: "#contact"
                - link "Usado neste site" [ref=e12] [cursor=pointer]:
                    - /url: /pt-BR/tech-stack/
            - generic [ref=e13]:
                - link "Linktree profile" [ref=e14] [cursor=pointer]:
                    - /url: https://linktr.ee/rogeriodocarmo
                    - img [ref=e15]
                    - generic [ref=e17]: Linktree
                - generic [ref=e18]:
                    - generic [ref=e19]: Select language
                    - generic [ref=e20]: 🇧🇷
                    - combobox "Select language" [ref=e21] [cursor=pointer]:
                        - option "🇧🇷 Português (BR)" [selected]
                        - option "🇺🇸 English"
                        - option "🇪🇸 Español"
                    - generic: ▾
                - button "Switch to dark mode" [ref=e22] [cursor=pointer]:
                    - img "Moon" [ref=e23]: 🌙
    - main [ref=e24]:
        - region "Hero section" [ref=e26]:
            - generic [ref=e27]:
                - generic [ref=e28]:
                    - paragraph [ref=e29]: Olá, eu sou
                    - heading "Rogério do Carmo" [level=1] [ref=e30]
                    - paragraph [ref=e31]: Desenvolvedor Frontend Mobile React Native
                    - generic [ref=e32]:
                        - img "UNESP Logo" [ref=e33]
                        - generic [ref=e34]:
                            - paragraph [ref=e35]: Bacharel em Ciência da Computação
                            - paragraph [ref=e36]: Mestre em Ciências Cartográficas
                            - paragraph [ref=e37]: UNESP
                    - generic [ref=e38]:
                        - paragraph [ref=e39]: Dissertação de mestrado completa
                        - link "Avaliação da qualidade das medidas e posicionamento GNSS em smartphones Android" [ref=e41] [cursor=pointer]:
                            - /url: http://hdl.handle.net/11449/243430
                            - img [ref=e42]
                            - text: Avaliação da qualidade das medidas e posicionamento GNSS em smartphones Android
                        - link "Baixar dissertação de mestrado em PDF" [ref=e47] [cursor=pointer]:
                            - /url: /academic/masters_degree_dissertation_rogerio_do_carmo.pdf
                            - img [ref=e48]
                            - generic [ref=e50]: Baixar Dissertação (PDF)
                    - generic [ref=e51]:
                        - img "Company Logo" [ref=e52]
                        - generic [ref=e53]:
                            - paragraph [ref=e54]: Desenvolvedor Mobile Sênior
                            - paragraph [ref=e55]: Atual
                    - generic [ref=e56]:
                        - link "Ver Meu Trabalho" [ref=e57] [cursor=pointer]:
                            - /url: "#projects"
                        - link "Entre em Contato" [ref=e58] [cursor=pointer]:
                            - /url: mailto:contato@rogeriodocarmo.com
                            - img [ref=e59]
                            - text: Entre em Contato
                    - paragraph [ref=e62]:
                        - link "contato@rogeriodocarmo.com" [ref=e63] [cursor=pointer]:
                            - /url: mailto:contato@rogeriodocarmo.com
                - img "Rogério do Carmo — Mobile React Native Developer" [ref=e66]
        - tablist "Escolha um Caminho" [ref=e69]:
            - generic [ref=e70]:
                - tab "Profissional" [selected] [ref=e71] [cursor=pointer]:
                    - img [ref=e72]
                    - text: Profissional
                - tab "Acadêmico" [ref=e74] [cursor=pointer]:
                    - img [ref=e75]
                    - text: Acadêmico
        - region "Experiência Profissional experiência" [ref=e80]:
            - generic [ref=e81]:
                - heading "Experiência Profissional" [level=2] [ref=e82]
                - generic [ref=e83]:
                    - article [ref=e84]:
                        - generic [ref=e85]:
                            - generic [ref=e86]:
                                - heading "Desenvolvedor Mobile React Native" [level=3] [ref=e87]
                                - paragraph [ref=e88]: Topaz · Remoto, Brasil
                                - paragraph [ref=e89]: Feb 2023 – Presente · 3 yrs 3 mo
                            - button "Expandir detalhes" [ref=e90] [cursor=pointer]:
                                - img [ref=e91]
                        - paragraph [ref=e93]: "Atuação no produto interno da empresa, voltado ao setor bancário. Desenvolvimento e manutenção de aplicativos móveis para instituições financeiras, com foco em funcionalidades críticas e experiência do usuário. ### Conquistas - Desenvolveu e implementou módulo Pix completo para aplicativos bancários, incluindo integração com DICT (Diretório de Identificadores de Contas Transacionais) - Implementou Login Biométrico com integração Daon para autenticação segura - Criou módulo de Empréstimo com fluxo completo de solicitação e aprovação - Prestou manutenção e correção de bugs em aplicativos bancários críticos - Atuou em projetos para clientes específicos: CrediSIS (Brasil), Bradescard (México), Banco Macro (Argentina) e Banco do Nordeste - BNB (Brasil) - Trabalhou com Google Play Console, Apple Developer e TestFlight para distribuição de apps - Implementou testes unitários com Jest para garantir qualidade do código - Utilizou ferramentas de monitoramento (Elastic, Kibana, Grafana) para análise de performance - Experiência com metodologias ágeis e comunicação eficiente com stakeholders (POs, BAs, QAs, SMs) - Orientação de desenvolvedores júnior em boas práticas de desenvolvimento React Native"
                    - article [ref=e94]:
                        - generic [ref=e95]:
                            - generic [ref=e96]:
                                - heading "Desenvolvedor Flutter" [level=3] [ref=e97]
                                - paragraph [ref=e98]: Rubcube · Remoto, Brasil
                                - paragraph [ref=e99]: Oct 2021 – Jan 2022 · 3 mo
                            - button "Expandir detalhes" [ref=e100] [cursor=pointer]:
                                - img [ref=e101]
                        - paragraph [ref=e103]: "Atuação no aplicativo móvel do cliente Virtus Pay, focando em manutenção e qualidade do código. ### Conquistas - Efetuou manutenção e correções de bugs no aplicativo Virtus Pay - Trabalhou com Flutter para desenvolvimento multiplataforma - Experiência com aplicativos de pagamento digital"
                    - article [ref=e104]:
                        - generic [ref=e105]:
                            - generic [ref=e106]:
                                - heading "Desenvolvedor Mobile React Native" [level=3] [ref=e107]
                                - paragraph [ref=e108]: Rubcube · Remoto, Brasil
                                - paragraph [ref=e109]: Jan 2022 – Mar 2023 · 1 yr 2 mo
                            - button "Expandir detalhes" [ref=e110] [cursor=pointer]:
                                - img [ref=e111]
                        - paragraph [ref=e113]: "Atuação no desenvolvimento do aplicativo móvel do cliente Banco Digi+, com foco em funcionalidades bancárias e experiência do usuário. ### Conquistas - Criou módulo Pix completo do zero para o Banco Digi+, incluindo todas as funcionalidades de transferência e pagamento - Efetuou manutenção e correções de bugs no aplicativo bancário - Trabalhou com MongoDB para persistência de dados - Desenvolveu componentes React Native em formato funcional e de classes - Desenvolveu website da empresa utilizando React JS - Experiência com integração de APIs REST para serviços bancários"
                    - article [ref=e114]:
                        - generic [ref=e115]:
                            - generic [ref=e116]:
                                - heading "Desenvolvedor Android/Flutter" [level=3] [ref=e117]
                                - paragraph [ref=e118]: Engeselt · Remoto, Brasil
                                - paragraph [ref=e119]: Apr 2021 – Oct 2021 · 6 mo
                            - button "Expandir detalhes" [ref=e120] [cursor=pointer]:
                                - img [ref=e121]
                        - paragraph [ref=e123]: "Entrada na empresa para efetuar prova de conceito do mestrado sobre dados GNSS (GPS). Após conclusão, permaneceu na empresa para atuação em produtos próprios do setor elétrico. ### Conquistas - Desenvolveu prova de conceito utilizando dados GNSS (GPS) do mestrado - Efetuou manutenção e correções de bugs no aplicativo da empresa do setor elétrico - Trabalhou com Flutter MobX para gerenciamento de estado - Implementou funcionalidades offline-first com SQFlite e OpenStreetMaps - Desenvolveu em Android Nativo utilizando Java e XML - Aplicou conhecimentos acadêmicos de GNSS em aplicações práticas"
                - generic [ref=e125]:
                    - heading "Linha do Tempo" [level=3] [ref=e126]
                    - list "Timeline" [ref=e127]:
                        - listitem [ref=e129]:
                            - generic "Work" [ref=e130]:
                                - generic [ref=e131]: Work
                            - time [ref=e132]: Feb 2023 – Present · 3 yrs 3 mo
                            - generic [ref=e133]:
                                - heading "Desenvolvedor Mobile React Native" [level=3] [ref=e134]
                                - paragraph [ref=e135]: Topaz · Remoto, Brasil
                                - paragraph [ref=e136]: "Atuação no produto interno da empresa, voltado ao setor bancário. Desenvolvimento e manutenção de aplicativos móveis para instituições financeiras, com foco em funcionalidades críticas e experiência do usuário. ### Conquistas - Desenvolveu e implementou módulo Pix completo para aplicativos bancários, incluindo integração com DICT (Diretório de Identificadores de Contas Transacionais) - Implementou Login Biométrico com integração Daon para autenticação segura - Criou módulo de Empréstimo com fluxo completo de solicitação e aprovação - Prestou manutenção e correção de bugs em aplicativos bancários críticos - Atuou em projetos para clientes específicos: CrediSIS (Brasil), Bradescard (México), Banco Macro (Argentina) e Banco do Nordeste - BNB (Brasil) - Trabalhou com Google Play Console, Apple Developer e TestFlight para distribuição de apps - Implementou testes unitários com Jest para garantir qualidade do código - Utilizou ferramentas de monitoramento (Elastic, Kibana, Grafana) para análise de performance - Experiência com metodologias ágeis e comunicação eficiente com stakeholders (POs, BAs, QAs, SMs) - Orientação de desenvolvedores júnior em boas práticas de desenvolvimento React Native"
                        - listitem [ref=e137]:
                            - generic "Work" [ref=e138]:
                                - generic [ref=e139]: Work
                            - time [ref=e140]: Oct 2021 – Jan 2022 · 3 mo
                            - generic [ref=e141]:
                                - heading "Desenvolvedor Flutter" [level=3] [ref=e142]
                                - paragraph [ref=e143]: Rubcube · Remoto, Brasil
                                - paragraph [ref=e144]: "Atuação no aplicativo móvel do cliente Virtus Pay, focando em manutenção e qualidade do código. ### Conquistas - Efetuou manutenção e correções de bugs no aplicativo Virtus Pay - Trabalhou com Flutter para desenvolvimento multiplataforma - Experiência com aplicativos de pagamento digital"
                        - listitem [ref=e145]:
                            - generic "Work" [ref=e146]:
                                - generic [ref=e147]: Work
                            - time [ref=e148]: Jan 2022 – Mar 2023 · 1 yr 2 mo
                            - generic [ref=e149]:
                                - heading "Desenvolvedor Mobile React Native" [level=3] [ref=e150]
                                - paragraph [ref=e151]: Rubcube · Remoto, Brasil
                                - paragraph [ref=e152]: "Atuação no desenvolvimento do aplicativo móvel do cliente Banco Digi+, com foco em funcionalidades bancárias e experiência do usuário. ### Conquistas - Criou módulo Pix completo do zero para o Banco Digi+, incluindo todas as funcionalidades de transferência e pagamento - Efetuou manutenção e correções de bugs no aplicativo bancário - Trabalhou com MongoDB para persistência de dados - Desenvolveu componentes React Native em formato funcional e de classes - Desenvolveu website da empresa utilizando React JS - Experiência com integração de APIs REST para serviços bancários"
                        - listitem [ref=e153]:
                            - generic "Work" [ref=e154]:
                                - generic [ref=e155]: Work
                            - time [ref=e156]: Apr 2021 – Oct 2021 · 6 mo
                            - generic [ref=e157]:
                                - heading "Desenvolvedor Android/Flutter" [level=3] [ref=e158]
                                - paragraph [ref=e159]: Engeselt · Remoto, Brasil
                                - paragraph [ref=e160]: "Entrada na empresa para efetuar prova de conceito do mestrado sobre dados GNSS (GPS). Após conclusão, permaneceu na empresa para atuação em produtos próprios do setor elétrico. ### Conquistas - Desenvolveu prova de conceito utilizando dados GNSS (GPS) do mestrado - Efetuou manutenção e correções de bugs no aplicativo da empresa do setor elétrico - Trabalhou com Flutter MobX para gerenciamento de estado - Implementou funcionalidades offline-first com SQFlite e OpenStreetMaps - Desenvolveu em Android Nativo utilizando Java e XML - Aplicou conhecimentos acadêmicos de GNSS em aplicações práticas"
        - region "Habilidades" [ref=e162]:
            - generic [ref=e163]:
                - heading "Habilidades" [level=2] [ref=e164]
                - generic [ref=e165]:
                    - generic [ref=e166]: Filtrar habilidades
                    - searchbox "Filtrar habilidades por nome" [ref=e167]
                - generic [ref=e168]:
                    - generic [ref=e169]:
                        - heading "Mobile Development" [level=2] [ref=e170]
                        - list "Mobile Development habilidades" [ref=e171]:
                            - listitem [ref=e172]:
                                - generic [ref=e173]: React Native
                                - 'generic "Nível: expert" [ref=e174]': expert
                            - listitem [ref=e175]:
                                - generic [ref=e176]: Flutter
                                - 'generic "Nível: intermediate" [ref=e177]': intermediate
                            - listitem [ref=e178]:
                                - generic [ref=e179]: Android Nativo (Java)
                                - 'generic "Nível: advanced" [ref=e180]': advanced
                            - listitem [ref=e181]:
                                - generic [ref=e182]: TypeScript
                                - 'generic "Nível: advanced" [ref=e183]': advanced
                            - listitem [ref=e184]:
                                - generic [ref=e185]: JavaScript
                                - 'generic "Nível: expert" [ref=e186]': expert
                    - generic [ref=e187]:
                        - heading "State Management & Architecture" [level=2] [ref=e188]
                        - list "State Management & Architecture habilidades" [ref=e189]:
                            - listitem [ref=e190]:
                                - generic [ref=e191]: Redux/Saga
                                - 'generic "Nível: advanced" [ref=e192]': advanced
                            - listitem [ref=e193]:
                                - generic [ref=e194]: Jotai
                                - 'generic "Nível: intermediate" [ref=e195]': intermediate
                            - listitem [ref=e196]:
                                - generic [ref=e197]: TankStack
                                - 'generic "Nível: intermediate" [ref=e198]': intermediate
                            - listitem [ref=e199]:
                                - generic [ref=e200]: MobX
                                - 'generic "Nível: intermediate" [ref=e201]': intermediate
                    - generic [ref=e202]:
                        - heading "UI & Styling" [level=2] [ref=e203]
                        - list "UI & Styling habilidades" [ref=e204]:
                            - listitem [ref=e205]:
                                - generic [ref=e206]: React Native StyleSheet
                                - 'generic "Nível: expert" [ref=e207]': expert
                            - listitem [ref=e208]:
                                - generic [ref=e209]: Styled Components
                                - 'generic "Nível: advanced" [ref=e210]': advanced
                            - listitem [ref=e211]:
                                - generic [ref=e212]: React JS
                                - 'generic "Nível: advanced" [ref=e213]': advanced
                    - generic [ref=e214]:
                        - heading "Forms & Validation" [level=2] [ref=e215]
                        - list "Forms & Validation habilidades" [ref=e216]:
                            - listitem [ref=e217]:
                                - generic [ref=e218]: react-hook-form
                                - 'generic "Nível: advanced" [ref=e219]': advanced
                            - listitem [ref=e220]:
                                - generic [ref=e221]: Validação de Formulários
                                - 'generic "Nível: expert" [ref=e222]': expert
                    - generic [ref=e223]:
                        - heading "Testing" [level=2] [ref=e224]
                        - list "Testing habilidades" [ref=e225]:
                            - listitem [ref=e226]:
                                - generic [ref=e227]: Jest
                                - 'generic "Nível: advanced" [ref=e228]': advanced
                            - listitem [ref=e229]:
                                - generic [ref=e230]: Testes Unitários
                                - 'generic "Nível: advanced" [ref=e231]': advanced
                    - generic [ref=e232]:
                        - heading "Firebase & Cloud Services" [level=2] [ref=e233]
                        - list "Firebase & Cloud Services habilidades" [ref=e234]:
                            - listitem [ref=e235]:
                                - generic [ref=e236]: Firebase Analytics
                                - 'generic "Nível: advanced" [ref=e237]': advanced
                            - listitem [ref=e238]:
                                - generic [ref=e239]: Firebase Crashlytics
                                - 'generic "Nível: advanced" [ref=e240]': advanced
                            - listitem [ref=e241]:
                                - generic [ref=e242]: Firebase Distribution
                                - 'generic "Nível: intermediate" [ref=e243]': intermediate
                            - listitem [ref=e244]:
                                - generic [ref=e245]: Firebase Storage
                                - 'generic "Nível: intermediate" [ref=e246]': intermediate
                    - generic [ref=e247]:
                        - heading "APIs & Integration" [level=2] [ref=e248]
                        - list "APIs & Integration habilidades" [ref=e249]:
                            - listitem [ref=e250]:
                                - generic [ref=e251]: REST APIs
                                - 'generic "Nível: expert" [ref=e252]': expert
                            - listitem [ref=e253]:
                                - generic [ref=e254]: AsyncStorage
                                - 'generic "Nível: expert" [ref=e255]': expert
                            - listitem [ref=e256]:
                                - generic [ref=e257]: MongoDB
                                - 'generic "Nível: intermediate" [ref=e258]': intermediate
                    - generic [ref=e259]:
                        - heading "Internationalization" [level=2] [ref=e260]
                        - list "Internationalization habilidades" [ref=e261]:
                            - listitem [ref=e262]:
                                - generic [ref=e263]: i18next
                                - 'generic "Nível: advanced" [ref=e264]': advanced
                            - listitem [ref=e265]:
                                - generic [ref=e266]: Localização de Apps
                                - 'generic "Nível: advanced" [ref=e267]': advanced
                    - generic [ref=e268]:
                        - heading "Native Modules & Integrations" [level=2] [ref=e269]
                        - list "Native Modules & Integrations habilidades" [ref=e270]:
                            - listitem [ref=e271]:
                                - generic [ref=e272]: Expo Modules
                                - 'generic "Nível: intermediate" [ref=e273]': intermediate
                            - listitem [ref=e274]:
                                - generic [ref=e275]: Daon (Biometria)
                                - 'generic "Nível: intermediate" [ref=e276]': intermediate
                            - listitem [ref=e277]:
                                - generic [ref=e278]: Qualtrics
                                - 'generic "Nível: intermediate" [ref=e279]': intermediate
                    - generic [ref=e280]:
                        - heading "Database & Storage" [level=2] [ref=e281]
                        - list "Database & Storage habilidades" [ref=e282]:
                            - listitem [ref=e283]:
                                - generic [ref=e284]: SQFlite
                                - 'generic "Nível: intermediate" [ref=e285]': intermediate
                            - listitem [ref=e286]:
                                - generic [ref=e287]: AsyncStorage
                                - 'generic "Nível: expert" [ref=e288]': expert
                            - listitem [ref=e289]:
                                - generic [ref=e290]: MongoDB
                                - 'generic "Nível: intermediate" [ref=e291]': intermediate
                    - generic [ref=e292]:
                        - heading "Maps & Location" [level=2] [ref=e293]
                        - list "Maps & Location habilidades" [ref=e294]:
                            - listitem [ref=e295]:
                                - generic [ref=e296]: OpenStreetMaps
                                - 'generic "Nível: intermediate" [ref=e297]': intermediate
                            - listitem [ref=e298]:
                                - generic [ref=e299]: GNSS/GPS
                                - 'generic "Nível: expert" [ref=e300]': expert
                            - listitem [ref=e301]:
                                - generic [ref=e302]: Geolocalização
                                - 'generic "Nível: advanced" [ref=e303]': advanced
                    - generic [ref=e304]:
                        - heading "DevOps & CI/CD" [level=2] [ref=e305]
                        - list "DevOps & CI/CD habilidades" [ref=e306]:
                            - listitem [ref=e307]:
                                - generic [ref=e308]: Google Play Console
                                - 'generic "Nível: advanced" [ref=e309]': advanced
                            - listitem [ref=e310]:
                                - generic [ref=e311]: Apple Developer
                                - 'generic "Nível: advanced" [ref=e312]': advanced
                            - listitem [ref=e313]:
                                - generic [ref=e314]: TestFlight
                                - 'generic "Nível: advanced" [ref=e315]': advanced
                            - listitem [ref=e316]:
                                - generic [ref=e317]: Jenkins
                                - 'generic "Nível: intermediate" [ref=e318]': intermediate
                            - listitem [ref=e319]:
                                - generic [ref=e320]: Fastlane
                                - 'generic "Nível: intermediate" [ref=e321]': intermediate
                            - listitem [ref=e322]:
                                - generic [ref=e323]: Git/GitHub/GitLab
                                - 'generic "Nível: expert" [ref=e324]': expert
                    - generic [ref=e325]:
                        - heading "Monitoring & Analytics" [level=2] [ref=e326]
                        - list "Monitoring & Analytics habilidades" [ref=e327]:
                            - listitem [ref=e328]:
                                - generic [ref=e329]: Elastic
                                - 'generic "Nível: intermediate" [ref=e330]': intermediate
                            - listitem [ref=e331]:
                                - generic [ref=e332]: Kibana
                                - 'generic "Nível: intermediate" [ref=e333]': intermediate
                            - listitem [ref=e334]:
                                - generic [ref=e335]: Grafana
                                - 'generic "Nível: intermediate" [ref=e336]': intermediate
                    - generic [ref=e337]:
                        - heading "Project Management" [level=2] [ref=e338]
                        - list "Project Management habilidades" [ref=e339]:
                            - listitem [ref=e340]:
                                - generic [ref=e341]: Jira
                                - 'generic "Nível: advanced" [ref=e342]': advanced
                            - listitem [ref=e343]:
                                - generic [ref=e344]: Confluence
                                - 'generic "Nível: intermediate" [ref=e345]': intermediate
                            - listitem [ref=e346]:
                                - generic [ref=e347]: Metodologias Ágeis
                                - 'generic "Nível: advanced" [ref=e348]': advanced
                    - generic [ref=e349]:
                        - heading "Backend & Desktop" [level=2] [ref=e350]
                        - list "Backend & Desktop habilidades" [ref=e351]:
                            - listitem [ref=e352]:
                                - generic [ref=e353]: Java
                                - 'generic "Nível: advanced" [ref=e354]': advanced
                            - listitem [ref=e355]:
                                - generic [ref=e356]: Java Swing
                                - 'generic "Nível: intermediate" [ref=e357]': intermediate
                            - listitem [ref=e358]:
                                - generic [ref=e359]: Python
                                - 'generic "Nível: intermediate" [ref=e360]': intermediate
                            - listitem [ref=e361]:
                                - generic [ref=e362]: C++
                                - 'generic "Nível: intermediate" [ref=e363]': intermediate
                    - generic [ref=e364]:
                        - heading "Domain Knowledge" [level=2] [ref=e365]
                        - list "Domain Knowledge habilidades" [ref=e366]:
                            - listitem [ref=e367]:
                                - generic [ref=e368]: Sistema Pix (DICT)
                                - 'generic "Nível: expert" [ref=e369]': expert
                            - listitem [ref=e370]:
                                - generic [ref=e371]: Aplicações Bancárias
                                - 'generic "Nível: expert" [ref=e372]': expert
                            - listitem [ref=e373]:
                                - generic [ref=e374]: Biometria e Autenticação
                                - 'generic "Nível: advanced" [ref=e375]': advanced
                            - listitem [ref=e376]:
                                - generic [ref=e377]: Processamento de Imagens
                                - 'generic "Nível: intermediate" [ref=e378]': intermediate
                            - listitem [ref=e379]:
                                - generic [ref=e380]: Ciências Cartográficas
                                - 'generic "Nível: advanced" [ref=e381]': advanced
                    - generic [ref=e382]:
                        - heading "Languages" [level=2] [ref=e383]
                        - list "Languages habilidades" [ref=e384]:
                            - listitem [ref=e385]:
                                - generic [ref=e386]: Português (Nativo)
                                - 'generic "Nível: expert" [ref=e387]': expert
                            - listitem [ref=e388]:
                                - generic [ref=e389]: Inglês (Intermediário-Avançado B2)
                                - 'generic "Nível: advanced" [ref=e390]': advanced
                    - generic [ref=e391]:
                        - heading "Soft Skills" [level=2] [ref=e392]
                        - list "Soft Skills habilidades" [ref=e393]:
                            - listitem [ref=e394]:
                                - generic [ref=e395]: Comunicação com Stakeholders
                                - 'generic "Nível: expert" [ref=e396]': expert
                            - listitem [ref=e397]:
                                - generic [ref=e398]: Orientação de Desenvolvedores
                                - 'generic "Nível: advanced" [ref=e399]': advanced
                            - listitem [ref=e400]:
                                - generic [ref=e401]: Trabalho em Equipe
                                - 'generic "Nível: expert" [ref=e402]': expert
                            - listitem [ref=e403]:
                                - generic [ref=e404]: Resolução de Problemas
                                - 'generic "Nível: expert" [ref=e405]': expert
                            - listitem [ref=e406]:
                                - generic [ref=e407]: Metodologias Ágeis
                                - 'generic "Nível: advanced" [ref=e408]': advanced
        - region "Projetos" [ref=e410]:
            - generic [ref=e411]:
                - heading "Projetos" [level=2] [ref=e412]
                - group "Filtrar por tecnologia" [ref=e413]:
                    - button "Todas" [pressed] [ref=e414] [cursor=pointer]
                    - button "Android Architecture Components" [ref=e415] [cursor=pointer]
                    - button "Android SDK" [ref=e416] [cursor=pointer]
                    - button "Data Processing" [ref=e417] [cursor=pointer]
                    - button "Firebase Analytics" [ref=e418] [cursor=pointer]
                    - button "Firebase Crashlytics" [ref=e419] [cursor=pointer]
                    - button "GNSS/GPS" [ref=e420] [cursor=pointer]
                    - button "Java" [ref=e421] [cursor=pointer]
                    - button "Jest" [ref=e422] [cursor=pointer]
                    - button "Material Design" [ref=e423] [cursor=pointer]
                    - button "NMEA Protocol" [ref=e424] [cursor=pointer]
                    - button "Next.js 16" [ref=e425] [cursor=pointer]
                    - button "Playwright" [ref=e426] [cursor=pointer]
                    - button "SQLite" [ref=e427] [cursor=pointer]
                    - button "Scientific Computing" [ref=e428] [cursor=pointer]
                    - button "Sentry" [ref=e429] [cursor=pointer]
                    - button "Tailwind CSS" [ref=e430] [cursor=pointer]
                    - button "TypeScript" [ref=e431] [cursor=pointer]
                    - button "Vercel" [ref=e432] [cursor=pointer]
                    - button "next-intl" [ref=e433] [cursor=pointer]
                - generic [ref=e434]:
                    - button "Ver detalhes de Personal Resume Website" [ref=e436] [cursor=pointer]:
                        - img "Personal Resume Website captura de tela 1" [ref=e438]
                        - generic [ref=e439]:
                            - heading "Personal Resume Website" [level=3] [ref=e440]
                            - generic [ref=e442]: Destaque
                        - paragraph [ref=e443]: Site de currículo pessoal moderno e responsivo com suporte multilíngue, modo escuro, e integração completa com Firebase Analytics
                        - generic [ref=e444]:
                            - generic [ref=e445]: Next.js 16
                            - generic [ref=e446]: TypeScript
                            - generic [ref=e447]: Tailwind CSS
                            - generic [ref=e448]: Firebase Analytics
                            - generic [ref=e449]: +6 mais
                    - button "Ver detalhes de Android Native Crud" [ref=e451] [cursor=pointer]:
                        - img "Android Native Crud captura de tela 1" [ref=e453]
                        - heading "Android Native Crud" [level=3] [ref=e455]
                        - paragraph [ref=e456]: Aplicação de exemplo para estudo inicial do ambiente Android, explorando componentes fundamentais e padrões de desenvolvimento
                        - generic [ref=e457]:
                            - generic [ref=e458]: Java
                            - generic [ref=e459]: Android SDK
                            - generic [ref=e460]: Material Design
                            - generic [ref=e461]: SQLite
                            - generic [ref=e462]: +1 mais
                    - button "Ver detalhes de INCT GNSS App" [ref=e464] [cursor=pointer]:
                        - img "INCT GNSS App captura de tela 1" [ref=e466]
                        - generic [ref=e467]:
                            - heading "INCT GNSS App" [level=3] [ref=e468]
                            - generic [ref=e470]: Destaque
                        - paragraph [ref=e471]: Aplicação Android para análise de dados GNSS (GPS) coletados pelo Google GNSSLogger, com processamento de medições NMEA
                        - generic [ref=e472]:
                            - generic [ref=e473]: Java
                            - generic [ref=e474]: Android SDK
                            - generic [ref=e475]: GNSS/GPS
                            - generic [ref=e476]: NMEA Protocol
                            - generic [ref=e477]: +2 mais
        - region "Entre em Contato" [ref=e478]:
            - generic [ref=e479]:
                - heading "Entre em Contato" [level=2] [ref=e480]
                - paragraph [ref=e481]: Tem um projeto em mente ou quer conversar? Envie-me uma mensagem!
                - generic [ref=e483]:
                    - img [ref=e484]
                    - generic [ref=e487]:
                        - paragraph [ref=e488]: E-mail Profissional
                        - link "contato@rogeriodocarmo.com" [ref=e489] [cursor=pointer]:
                            - /url: mailto:contato@rogeriodocarmo.com
                        - paragraph [ref=e490]: Ou use o formulário abaixo para me enviar uma mensagem
                - form "Formulário de contato" [ref=e491]:
                    - generic [ref=e492]:
                        - generic [ref=e493]: Nome *
                        - textbox "Nome" [ref=e494]:
                            - /placeholder: Seu nome
                    - generic [ref=e495]:
                        - generic [ref=e496]: E-mail *
                        - textbox "E-mail" [ref=e497]:
                            - /placeholder: seu@email.com
                    - generic [ref=e498]:
                        - generic [ref=e499]: Mensagem *
                        - textbox "Mensagem" [ref=e500]:
                            - /placeholder: Sua mensagem (pelo menos 10 caracteres)
                    - button "Enviar Mensagem" [ref=e501] [cursor=pointer]
    - contentinfo [ref=e502]:
        - generic [ref=e503]:
            - generic [ref=e504]:
                - generic [ref=e505]:
                    - heading "Navegar" [level=2] [ref=e506]
                    - list [ref=e507]:
                        - listitem [ref=e508]:
                            - link "Início" [ref=e509] [cursor=pointer]:
                                - /url: "#home"
                        - listitem [ref=e510]:
                            - link "Projetos" [ref=e511] [cursor=pointer]:
                                - /url: "#projects"
                        - listitem [ref=e512]:
                            - link "Experiência" [ref=e513] [cursor=pointer]:
                                - /url: "#experience"
                        - listitem [ref=e514]:
                            - link "Habilidades" [ref=e515] [cursor=pointer]:
                                - /url: "#skills"
                        - listitem [ref=e516]:
                            - link "Contato" [ref=e517] [cursor=pointer]:
                                - /url: "#contact"
                        - listitem [ref=e518]:
                            - link "Usado neste site" [ref=e519] [cursor=pointer]:
                                - /url: "#tech-stack"
                - generic [ref=e520]:
                    - heading "Idiomas" [level=2] [ref=e521]
                    - list [ref=e522]:
                        - listitem [ref=e523]:
                            - link "Português (pt-BR)" [ref=e524] [cursor=pointer]:
                                - /url: /pt-BR
                        - listitem [ref=e525]:
                            - link "English (en)" [ref=e526] [cursor=pointer]:
                                - /url: /en
                        - listitem [ref=e527]:
                            - link "Español (es)" [ref=e528] [cursor=pointer]:
                                - /url: /es
                - generic [ref=e529]:
                    - heading "Conectar" [level=2] [ref=e530]
                    - list [ref=e531]:
                        - listitem [ref=e532]:
                            - link "E-mail Profissional" [ref=e533] [cursor=pointer]:
                                - /url: mailto:contato@rogeriodocarmo.com
                                - img [ref=e534]
                                - generic [ref=e537]: contato@rogeriodocarmo.com
                        - listitem [ref=e538]:
                            - link "Baixar currículo em formato PDF" [ref=e539] [cursor=pointer]:
                                - /url: /resumes/resume.pdf
                                - img [ref=e540]
                                - generic [ref=e542]: Baixar Currículo
                        - listitem [ref=e543]:
                            - link "Baixar dissertação de mestrado em formato PDF" [ref=e544] [cursor=pointer]:
                                - /url: /academic/masters_degree_dissertation_rogerio_do_carmo.pdf
                                - img [ref=e545]
                                - generic [ref=e547]: Baixar Dissertação
                        - listitem [ref=e548]:
                            - link "Linktree profile" [ref=e549] [cursor=pointer]:
                                - /url: https://linktr.ee/rogeriodocarmo
                                - img [ref=e550]
                                - generic [ref=e552]: Linktree
                        - listitem [ref=e553]:
                            - link "LinkedIn profile" [ref=e554] [cursor=pointer]:
                                - /url: https://www.linkedin.com/in/rogeriodocarmo/
                                - img [ref=e555]
                                - generic [ref=e557]: LinkedIn
                        - listitem [ref=e558]:
                            - link "GitHub profile" [ref=e559] [cursor=pointer]:
                                - /url: https://github.com/RogerioDoCarmo/curriculo
                                - img [ref=e560]
                                - generic [ref=e562]: GitHub
                        - listitem [ref=e563]:
                            - button "Imprimir página do site" [ref=e564] [cursor=pointer]:
                                - img [ref=e565]
                                - generic [ref=e569]: Imprimir Página
            - paragraph [ref=e571]: © 2026 Rogério do Carmo. Todos os direitos reservados.
    - dialog "Este site usa cookies" [ref=e572]:
        - generic [ref=e573]:
            - heading "Este site usa cookies" [level=2] [ref=e574]
            - paragraph [ref=e575]: Usamos cookies essenciais para o funcionamento do site e cookies de análise para entender como você interage com nosso conteúdo. Todos os dados de análise são anônimos e não incluem informações pessoais.
            - generic [ref=e576]:
                - generic [ref=e577]:
                    - img [ref=e579]
                    - generic [ref=e581]:
                        - paragraph [ref=e582]: Cookies Essenciais
                        - paragraph [ref=e583]: Necessários para o funcionamento básico do site (tema, idioma, sessão). Sempre ativos.
                - generic [ref=e584]:
                    - img [ref=e586]
                    - generic [ref=e588]:
                        - paragraph [ref=e589]: Cookies de Análise
                        - paragraph [ref=e590]: Ajudam a entender como os visitantes interagem com o site através do Firebase Analytics. Dados anônimos.
            - generic [ref=e591]:
                - button "Aceitar Todos" [ref=e592] [cursor=pointer]
                - button "Rejeitar Não-Essenciais" [ref=e593] [cursor=pointer]
                - button "Personalizar" [ref=e594] [cursor=pointer]
            - paragraph [ref=e595]:
                - text: Saiba mais em nossa
                - link "Política de Privacidade" [ref=e596] [cursor=pointer]:
                    - /url: /privacy
                - text: e
                - link "Política de Cookies" [ref=e597] [cursor=pointer]:
                    - /url: /cookies
```

# Test source

```ts
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
  426 |       await expect(banner.getByText(/cookies/i)).toBeVisible();
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
> 442 |       await expect(acceptButton).toBeFocused();
      |                                  ^ Error: expect(locator).toBeFocused() failed
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
