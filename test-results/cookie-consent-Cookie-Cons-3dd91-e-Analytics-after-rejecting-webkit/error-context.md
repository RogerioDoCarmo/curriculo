# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cookie-consent.spec.ts >> Cookie Consent Banner >> Reject non-essential flow >> should NOT enable Firebase Analytics after rejecting
- Location: tests/e2e/cookie-consent.spec.ts:169:9

# Error details

```
Error: page.goto: Navigation to "http://localhost:3000/" is interrupted by another navigation to "http://localhost:3000/pt-BR/"
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
    - banner [ref=e2]:
        - generic [ref=e4]:
            - navigation "Main navigation" [ref=e5]:
                - link "Início" [ref=e6]:
                    - /url: "#home"
                - link "Projetos" [ref=e7]:
                    - /url: "#projects"
                - link "Experiência" [ref=e8]:
                    - /url: "#experience"
                - link "Habilidades" [ref=e9]:
                    - /url: "#skills"
                - link "Contato" [ref=e10]:
                    - /url: "#contact"
                - link "Usado neste site" [ref=e11]:
                    - /url: /pt-BR/tech-stack/
            - generic [ref=e12]:
                - link "Linktree profile" [ref=e13]:
                    - /url: https://linktr.ee/rogeriodocarmo
                    - img [ref=e14]
                    - generic [ref=e16]: Linktree
                - generic [ref=e17]:
                    - generic [ref=e18]: Select language
                    - generic [ref=e19]: 🇧🇷
                    - combobox "Select language" [ref=e20] [cursor=pointer]:
                        - option "🇧🇷 Português (BR)" [selected]
                        - option "🇺🇸 English"
                        - option "🇪🇸 Español"
                    - generic: ▾
                - button "Switch to dark mode" [ref=e21] [cursor=pointer]:
                    - img "Moon" [ref=e22]: 🌙
    - main [ref=e23]:
        - region "Hero section" [ref=e25]:
            - generic [ref=e26]:
                - generic [ref=e27]:
                    - paragraph [ref=e28]: Olá, eu sou
                    - heading "Rogério do Carmo" [level=1] [ref=e29]
                    - paragraph [ref=e30]: Desenvolvedor Frontend Mobile React Native
                    - generic [ref=e31]:
                        - img "UNESP Logo" [ref=e32]
                        - generic [ref=e33]:
                            - paragraph [ref=e34]: Bacharel em Ciência da Computação
                            - paragraph [ref=e35]: Mestre em Ciências Cartográficas
                            - paragraph [ref=e36]: UNESP
                    - generic [ref=e37]:
                        - paragraph [ref=e38]: Dissertação de mestrado completa
                        - link "Avaliação da qualidade das medidas e posicionamento GNSS em smartphones Android" [ref=e40]:
                            - /url: http://hdl.handle.net/11449/243430
                            - img [ref=e41]
                            - text: Avaliação da qualidade das medidas e posicionamento GNSS em smartphones Android
                        - link "Baixar dissertação de mestrado em PDF" [ref=e46]:
                            - /url: /academic/masters_degree_dissertation_rogerio_do_carmo.pdf
                            - img [ref=e47]
                            - generic [ref=e49]: Baixar Dissertação (PDF)
                    - generic [ref=e50]:
                        - img "Company Logo" [ref=e51]
                        - generic [ref=e52]:
                            - paragraph [ref=e53]: Desenvolvedor Mobile Sênior
                            - paragraph [ref=e54]: Atual
                    - generic [ref=e55]:
                        - link "Ver Meu Trabalho" [ref=e56]:
                            - /url: "#projects"
                        - link "Entre em Contato" [ref=e57]:
                            - /url: mailto:contato@rogeriodocarmo.com
                            - img [ref=e58]
                            - text: Entre em Contato
                    - paragraph [ref=e61]:
                        - link "contato@rogeriodocarmo.com" [ref=e62]:
                            - /url: mailto:contato@rogeriodocarmo.com
                - img "Rogério do Carmo — Mobile React Native Developer" [ref=e65]
        - tablist "Escolha um Caminho" [ref=e68]:
            - generic [ref=e69]:
                - tab "Profissional" [selected] [ref=e70] [cursor=pointer]:
                    - img [ref=e71]
                    - text: Profissional
                - tab "Acadêmico" [ref=e73] [cursor=pointer]:
                    - img [ref=e74]
                    - text: Acadêmico
        - region "Experiência Profissional experiência" [ref=e79]:
            - generic [ref=e80]:
                - heading "Experiência Profissional" [level=2] [ref=e81]
                - generic [ref=e82]:
                    - article [ref=e83]:
                        - generic [ref=e84]:
                            - generic [ref=e85]:
                                - heading "Desenvolvedor Mobile React Native" [level=3] [ref=e86]
                                - paragraph [ref=e87]: Topaz · Remoto, Brasil
                                - paragraph [ref=e88]: Feb 2023 – Presente · 3 yrs 3 mo
                            - button "Expandir detalhes" [ref=e89] [cursor=pointer]:
                                - img [ref=e90]
                        - paragraph [ref=e92]: "Atuação no produto interno da empresa, voltado ao setor bancário. Desenvolvimento e manutenção de aplicativos móveis para instituições financeiras, com foco em funcionalidades críticas e experiência do usuário. ### Conquistas - Desenvolveu e implementou módulo Pix completo para aplicativos bancários, incluindo integração com DICT (Diretório de Identificadores de Contas Transacionais) - Implementou Login Biométrico com integração Daon para autenticação segura - Criou módulo de Empréstimo com fluxo completo de solicitação e aprovação - Prestou manutenção e correção de bugs em aplicativos bancários críticos - Atuou em projetos para clientes específicos: CrediSIS (Brasil), Bradescard (México), Banco Macro (Argentina) e Banco do Nordeste - BNB (Brasil) - Trabalhou com Google Play Console, Apple Developer e TestFlight para distribuição de apps - Implementou testes unitários com Jest para garantir qualidade do código - Utilizou ferramentas de monitoramento (Elastic, Kibana, Grafana) para análise de performance - Experiência com metodologias ágeis e comunicação eficiente com stakeholders (POs, BAs, QAs, SMs) - Orientação de desenvolvedores júnior em boas práticas de desenvolvimento React Native"
                    - article [ref=e93]:
                        - generic [ref=e94]:
                            - generic [ref=e95]:
                                - heading "Desenvolvedor Flutter" [level=3] [ref=e96]
                                - paragraph [ref=e97]: Rubcube · Remoto, Brasil
                                - paragraph [ref=e98]: Oct 2021 – Jan 2022 · 3 mo
                            - button "Expandir detalhes" [ref=e99] [cursor=pointer]:
                                - img [ref=e100]
                        - paragraph [ref=e102]: "Atuação no aplicativo móvel do cliente Virtus Pay, focando em manutenção e qualidade do código. ### Conquistas - Efetuou manutenção e correções de bugs no aplicativo Virtus Pay - Trabalhou com Flutter para desenvolvimento multiplataforma - Experiência com aplicativos de pagamento digital"
                    - article [ref=e103]:
                        - generic [ref=e104]:
                            - generic [ref=e105]:
                                - heading "Desenvolvedor Mobile React Native" [level=3] [ref=e106]
                                - paragraph [ref=e107]: Rubcube · Remoto, Brasil
                                - paragraph [ref=e108]: Jan 2022 – Mar 2023 · 1 yr 2 mo
                            - button "Expandir detalhes" [ref=e109] [cursor=pointer]:
                                - img [ref=e110]
                        - paragraph [ref=e112]: "Atuação no desenvolvimento do aplicativo móvel do cliente Banco Digi+, com foco em funcionalidades bancárias e experiência do usuário. ### Conquistas - Criou módulo Pix completo do zero para o Banco Digi+, incluindo todas as funcionalidades de transferência e pagamento - Efetuou manutenção e correções de bugs no aplicativo bancário - Trabalhou com MongoDB para persistência de dados - Desenvolveu componentes React Native em formato funcional e de classes - Desenvolveu website da empresa utilizando React JS - Experiência com integração de APIs REST para serviços bancários"
                    - article [ref=e113]:
                        - generic [ref=e114]:
                            - generic [ref=e115]:
                                - heading "Desenvolvedor Android/Flutter" [level=3] [ref=e116]
                                - paragraph [ref=e117]: Engeselt · Remoto, Brasil
                                - paragraph [ref=e118]: Apr 2021 – Oct 2021 · 6 mo
                            - button "Expandir detalhes" [ref=e119] [cursor=pointer]:
                                - img [ref=e120]
                        - paragraph [ref=e122]: "Entrada na empresa para efetuar prova de conceito do mestrado sobre dados GNSS (GPS). Após conclusão, permaneceu na empresa para atuação em produtos próprios do setor elétrico. ### Conquistas - Desenvolveu prova de conceito utilizando dados GNSS (GPS) do mestrado - Efetuou manutenção e correções de bugs no aplicativo da empresa do setor elétrico - Trabalhou com Flutter MobX para gerenciamento de estado - Implementou funcionalidades offline-first com SQFlite e OpenStreetMaps - Desenvolveu em Android Nativo utilizando Java e XML - Aplicou conhecimentos acadêmicos de GNSS em aplicações práticas"
                - generic [ref=e124]:
                    - heading "Linha do Tempo" [level=3] [ref=e125]
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
                    - searchbox "Filtrar habilidades por nome" [ref=e166]
                - generic [ref=e167]:
                    - generic [ref=e168]:
                        - heading "Mobile Development" [level=2] [ref=e169]
                        - list "Mobile Development habilidades" [ref=e170]:
                            - listitem [ref=e171]:
                                - generic [ref=e172]: React Native
                                - 'generic "Nível: expert" [ref=e173]': expert
                            - listitem [ref=e174]:
                                - generic [ref=e175]: Flutter
                                - 'generic "Nível: intermediate" [ref=e176]': intermediate
                            - listitem [ref=e177]:
                                - generic [ref=e178]: Android Nativo (Java)
                                - 'generic "Nível: advanced" [ref=e179]': advanced
                            - listitem [ref=e180]:
                                - generic [ref=e181]: TypeScript
                                - 'generic "Nível: advanced" [ref=e182]': advanced
                            - listitem [ref=e183]:
                                - generic [ref=e184]: JavaScript
                                - 'generic "Nível: expert" [ref=e185]': expert
                    - generic [ref=e186]:
                        - heading "State Management & Architecture" [level=2] [ref=e187]
                        - list "State Management & Architecture habilidades" [ref=e188]:
                            - listitem [ref=e189]:
                                - generic [ref=e190]: Redux/Saga
                                - 'generic "Nível: advanced" [ref=e191]': advanced
                            - listitem [ref=e192]:
                                - generic [ref=e193]: Jotai
                                - 'generic "Nível: intermediate" [ref=e194]': intermediate
                            - listitem [ref=e195]:
                                - generic [ref=e196]: TankStack
                                - 'generic "Nível: intermediate" [ref=e197]': intermediate
                            - listitem [ref=e198]:
                                - generic [ref=e199]: MobX
                                - 'generic "Nível: intermediate" [ref=e200]': intermediate
                    - generic [ref=e201]:
                        - heading "UI & Styling" [level=2] [ref=e202]
                        - list "UI & Styling habilidades" [ref=e203]:
                            - listitem [ref=e204]:
                                - generic [ref=e205]: React Native StyleSheet
                                - 'generic "Nível: expert" [ref=e206]': expert
                            - listitem [ref=e207]:
                                - generic [ref=e208]: Styled Components
                                - 'generic "Nível: advanced" [ref=e209]': advanced
                            - listitem [ref=e210]:
                                - generic [ref=e211]: React JS
                                - 'generic "Nível: advanced" [ref=e212]': advanced
                    - generic [ref=e213]:
                        - heading "Forms & Validation" [level=2] [ref=e214]
                        - list "Forms & Validation habilidades" [ref=e215]:
                            - listitem [ref=e216]:
                                - generic [ref=e217]: react-hook-form
                                - 'generic "Nível: advanced" [ref=e218]': advanced
                            - listitem [ref=e219]:
                                - generic [ref=e220]: Validação de Formulários
                                - 'generic "Nível: expert" [ref=e221]': expert
                    - generic [ref=e222]:
                        - heading "Testing" [level=2] [ref=e223]
                        - list "Testing habilidades" [ref=e224]:
                            - listitem [ref=e225]:
                                - generic [ref=e226]: Jest
                                - 'generic "Nível: advanced" [ref=e227]': advanced
                            - listitem [ref=e228]:
                                - generic [ref=e229]: Testes Unitários
                                - 'generic "Nível: advanced" [ref=e230]': advanced
                    - generic [ref=e231]:
                        - heading "Firebase & Cloud Services" [level=2] [ref=e232]
                        - list "Firebase & Cloud Services habilidades" [ref=e233]:
                            - listitem [ref=e234]:
                                - generic [ref=e235]: Firebase Analytics
                                - 'generic "Nível: advanced" [ref=e236]': advanced
                            - listitem [ref=e237]:
                                - generic [ref=e238]: Firebase Crashlytics
                                - 'generic "Nível: advanced" [ref=e239]': advanced
                            - listitem [ref=e240]:
                                - generic [ref=e241]: Firebase Distribution
                                - 'generic "Nível: intermediate" [ref=e242]': intermediate
                            - listitem [ref=e243]:
                                - generic [ref=e244]: Firebase Storage
                                - 'generic "Nível: intermediate" [ref=e245]': intermediate
                    - generic [ref=e246]:
                        - heading "APIs & Integration" [level=2] [ref=e247]
                        - list "APIs & Integration habilidades" [ref=e248]:
                            - listitem [ref=e249]:
                                - generic [ref=e250]: REST APIs
                                - 'generic "Nível: expert" [ref=e251]': expert
                            - listitem [ref=e252]:
                                - generic [ref=e253]: AsyncStorage
                                - 'generic "Nível: expert" [ref=e254]': expert
                            - listitem [ref=e255]:
                                - generic [ref=e256]: MongoDB
                                - 'generic "Nível: intermediate" [ref=e257]': intermediate
                    - generic [ref=e258]:
                        - heading "Internationalization" [level=2] [ref=e259]
                        - list "Internationalization habilidades" [ref=e260]:
                            - listitem [ref=e261]:
                                - generic [ref=e262]: i18next
                                - 'generic "Nível: advanced" [ref=e263]': advanced
                            - listitem [ref=e264]:
                                - generic [ref=e265]: Localização de Apps
                                - 'generic "Nível: advanced" [ref=e266]': advanced
                    - generic [ref=e267]:
                        - heading "Native Modules & Integrations" [level=2] [ref=e268]
                        - list "Native Modules & Integrations habilidades" [ref=e269]:
                            - listitem [ref=e270]:
                                - generic [ref=e271]: Expo Modules
                                - 'generic "Nível: intermediate" [ref=e272]': intermediate
                            - listitem [ref=e273]:
                                - generic [ref=e274]: Daon (Biometria)
                                - 'generic "Nível: intermediate" [ref=e275]': intermediate
                            - listitem [ref=e276]:
                                - generic [ref=e277]: Qualtrics
                                - 'generic "Nível: intermediate" [ref=e278]': intermediate
                    - generic [ref=e279]:
                        - heading "Database & Storage" [level=2] [ref=e280]
                        - list "Database & Storage habilidades" [ref=e281]:
                            - listitem [ref=e282]:
                                - generic [ref=e283]: SQFlite
                                - 'generic "Nível: intermediate" [ref=e284]': intermediate
                            - listitem [ref=e285]:
                                - generic [ref=e286]: AsyncStorage
                                - 'generic "Nível: expert" [ref=e287]': expert
                            - listitem [ref=e288]:
                                - generic [ref=e289]: MongoDB
                                - 'generic "Nível: intermediate" [ref=e290]': intermediate
                    - generic [ref=e291]:
                        - heading "Maps & Location" [level=2] [ref=e292]
                        - list "Maps & Location habilidades" [ref=e293]:
                            - listitem [ref=e294]:
                                - generic [ref=e295]: OpenStreetMaps
                                - 'generic "Nível: intermediate" [ref=e296]': intermediate
                            - listitem [ref=e297]:
                                - generic [ref=e298]: GNSS/GPS
                                - 'generic "Nível: expert" [ref=e299]': expert
                            - listitem [ref=e300]:
                                - generic [ref=e301]: Geolocalização
                                - 'generic "Nível: advanced" [ref=e302]': advanced
                    - generic [ref=e303]:
                        - heading "DevOps & CI/CD" [level=2] [ref=e304]
                        - list "DevOps & CI/CD habilidades" [ref=e305]:
                            - listitem [ref=e306]:
                                - generic [ref=e307]: Google Play Console
                                - 'generic "Nível: advanced" [ref=e308]': advanced
                            - listitem [ref=e309]:
                                - generic [ref=e310]: Apple Developer
                                - 'generic "Nível: advanced" [ref=e311]': advanced
                            - listitem [ref=e312]:
                                - generic [ref=e313]: TestFlight
                                - 'generic "Nível: advanced" [ref=e314]': advanced
                            - listitem [ref=e315]:
                                - generic [ref=e316]: Jenkins
                                - 'generic "Nível: intermediate" [ref=e317]': intermediate
                            - listitem [ref=e318]:
                                - generic [ref=e319]: Fastlane
                                - 'generic "Nível: intermediate" [ref=e320]': intermediate
                            - listitem [ref=e321]:
                                - generic [ref=e322]: Git/GitHub/GitLab
                                - 'generic "Nível: expert" [ref=e323]': expert
                    - generic [ref=e324]:
                        - heading "Monitoring & Analytics" [level=2] [ref=e325]
                        - list "Monitoring & Analytics habilidades" [ref=e326]:
                            - listitem [ref=e327]:
                                - generic [ref=e328]: Elastic
                                - 'generic "Nível: intermediate" [ref=e329]': intermediate
                            - listitem [ref=e330]:
                                - generic [ref=e331]: Kibana
                                - 'generic "Nível: intermediate" [ref=e332]': intermediate
                            - listitem [ref=e333]:
                                - generic [ref=e334]: Grafana
                                - 'generic "Nível: intermediate" [ref=e335]': intermediate
                    - generic [ref=e336]:
                        - heading "Project Management" [level=2] [ref=e337]
                        - list "Project Management habilidades" [ref=e338]:
                            - listitem [ref=e339]:
                                - generic [ref=e340]: Jira
                                - 'generic "Nível: advanced" [ref=e341]': advanced
                            - listitem [ref=e342]:
                                - generic [ref=e343]: Confluence
                                - 'generic "Nível: intermediate" [ref=e344]': intermediate
                            - listitem [ref=e345]:
                                - generic [ref=e346]: Metodologias Ágeis
                                - 'generic "Nível: advanced" [ref=e347]': advanced
                    - generic [ref=e348]:
                        - heading "Backend & Desktop" [level=2] [ref=e349]
                        - list "Backend & Desktop habilidades" [ref=e350]:
                            - listitem [ref=e351]:
                                - generic [ref=e352]: Java
                                - 'generic "Nível: advanced" [ref=e353]': advanced
                            - listitem [ref=e354]:
                                - generic [ref=e355]: Java Swing
                                - 'generic "Nível: intermediate" [ref=e356]': intermediate
                            - listitem [ref=e357]:
                                - generic [ref=e358]: Python
                                - 'generic "Nível: intermediate" [ref=e359]': intermediate
                            - listitem [ref=e360]:
                                - generic [ref=e361]: C++
                                - 'generic "Nível: intermediate" [ref=e362]': intermediate
                    - generic [ref=e363]:
                        - heading "Domain Knowledge" [level=2] [ref=e364]
                        - list "Domain Knowledge habilidades" [ref=e365]:
                            - listitem [ref=e366]:
                                - generic [ref=e367]: Sistema Pix (DICT)
                                - 'generic "Nível: expert" [ref=e368]': expert
                            - listitem [ref=e369]:
                                - generic [ref=e370]: Aplicações Bancárias
                                - 'generic "Nível: expert" [ref=e371]': expert
                            - listitem [ref=e372]:
                                - generic [ref=e373]: Biometria e Autenticação
                                - 'generic "Nível: advanced" [ref=e374]': advanced
                            - listitem [ref=e375]:
                                - generic [ref=e376]: Processamento de Imagens
                                - 'generic "Nível: intermediate" [ref=e377]': intermediate
                            - listitem [ref=e378]:
                                - generic [ref=e379]: Ciências Cartográficas
                                - 'generic "Nível: advanced" [ref=e380]': advanced
                    - generic [ref=e381]:
                        - heading "Languages" [level=2] [ref=e382]
                        - list "Languages habilidades" [ref=e383]:
                            - listitem [ref=e384]:
                                - generic [ref=e385]: Português (Nativo)
                                - 'generic "Nível: expert" [ref=e386]': expert
                            - listitem [ref=e387]:
                                - generic [ref=e388]: Inglês (Intermediário-Avançado B2)
                                - 'generic "Nível: advanced" [ref=e389]': advanced
                    - generic [ref=e390]:
                        - heading "Soft Skills" [level=2] [ref=e391]
                        - list "Soft Skills habilidades" [ref=e392]:
                            - listitem [ref=e393]:
                                - generic [ref=e394]: Comunicação com Stakeholders
                                - 'generic "Nível: expert" [ref=e395]': expert
                            - listitem [ref=e396]:
                                - generic [ref=e397]: Orientação de Desenvolvedores
                                - 'generic "Nível: advanced" [ref=e398]': advanced
                            - listitem [ref=e399]:
                                - generic [ref=e400]: Trabalho em Equipe
                                - 'generic "Nível: expert" [ref=e401]': expert
                            - listitem [ref=e402]:
                                - generic [ref=e403]: Resolução de Problemas
                                - 'generic "Nível: expert" [ref=e404]': expert
                            - listitem [ref=e405]:
                                - generic [ref=e406]: Metodologias Ágeis
                                - 'generic "Nível: advanced" [ref=e407]': advanced
        - region "Projetos" [ref=e409]:
            - generic [ref=e410]:
                - heading "Projetos" [level=2] [ref=e411]
                - group "Filtrar por tecnologia" [ref=e412]:
                    - button "Todas" [pressed] [ref=e413] [cursor=pointer]
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
                    - button "Ver detalhes de Personal Resume Website" [ref=e435] [cursor=pointer]:
                        - img "Personal Resume Website captura de tela 1" [ref=e437]
                        - generic [ref=e438]:
                            - heading "Personal Resume Website" [level=3] [ref=e439]
                            - generic [ref=e441]: Destaque
                        - paragraph [ref=e442]: Site de currículo pessoal moderno e responsivo com suporte multilíngue, modo escuro, e integração completa com Firebase Analytics
                        - generic [ref=e443]:
                            - generic [ref=e444]: Next.js 16
                            - generic [ref=e445]: TypeScript
                            - generic [ref=e446]: Tailwind CSS
                            - generic [ref=e447]: Firebase Analytics
                            - generic [ref=e448]: +6 mais
                    - button "Ver detalhes de Android Native Crud" [ref=e450] [cursor=pointer]:
                        - img "Android Native Crud captura de tela 1" [ref=e452]
                        - heading "Android Native Crud" [level=3] [ref=e454]
                        - paragraph [ref=e455]: Aplicação de exemplo para estudo inicial do ambiente Android, explorando componentes fundamentais e padrões de desenvolvimento
                        - generic [ref=e456]:
                            - generic [ref=e457]: Java
                            - generic [ref=e458]: Android SDK
                            - generic [ref=e459]: Material Design
                            - generic [ref=e460]: SQLite
                            - generic [ref=e461]: +1 mais
                    - button "Ver detalhes de INCT GNSS App" [ref=e463] [cursor=pointer]:
                        - img "INCT GNSS App captura de tela 1" [ref=e465]
                        - generic [ref=e466]:
                            - heading "INCT GNSS App" [level=3] [ref=e467]
                            - generic [ref=e469]: Destaque
                        - paragraph [ref=e470]: Aplicação Android para análise de dados GNSS (GPS) coletados pelo Google GNSSLogger, com processamento de medições NMEA
                        - generic [ref=e471]:
                            - generic [ref=e472]: Java
                            - generic [ref=e473]: Android SDK
                            - generic [ref=e474]: GNSS/GPS
                            - generic [ref=e475]: NMEA Protocol
                            - generic [ref=e476]: +2 mais
        - region "Entre em Contato" [ref=e477]:
            - generic [ref=e478]:
                - heading "Entre em Contato" [level=2] [ref=e479]
                - paragraph [ref=e480]: Tem um projeto em mente ou quer conversar? Envie-me uma mensagem!
                - generic [ref=e482]:
                    - img [ref=e483]
                    - generic [ref=e486]:
                        - paragraph [ref=e487]: E-mail Profissional
                        - link "contato@rogeriodocarmo.com" [ref=e488]:
                            - /url: mailto:contato@rogeriodocarmo.com
                        - paragraph [ref=e489]: Ou use o formulário abaixo para me enviar uma mensagem
                - form "Formulário de contato" [ref=e490]:
                    - generic [ref=e491]:
                        - generic [ref=e492]: Nome *
                        - textbox "Nome" [ref=e493]:
                            - /placeholder: Seu nome
                    - generic [ref=e494]:
                        - generic [ref=e495]: E-mail *
                        - textbox "E-mail" [ref=e496]:
                            - /placeholder: seu@email.com
                    - generic [ref=e497]:
                        - generic [ref=e498]: Mensagem *
                        - textbox "Mensagem" [ref=e499]:
                            - /placeholder: Sua mensagem (pelo menos 10 caracteres)
                    - button "Enviar Mensagem" [ref=e500] [cursor=pointer]
    - contentinfo [ref=e501]:
        - generic [ref=e502]:
            - generic [ref=e503]:
                - generic [ref=e504]:
                    - heading "Navegar" [level=2] [ref=e505]
                    - list [ref=e506]:
                        - listitem [ref=e507]:
                            - link "Início" [ref=e508]:
                                - /url: "#home"
                        - listitem [ref=e509]:
                            - link "Projetos" [ref=e510]:
                                - /url: "#projects"
                        - listitem [ref=e511]:
                            - link "Experiência" [ref=e512]:
                                - /url: "#experience"
                        - listitem [ref=e513]:
                            - link "Habilidades" [ref=e514]:
                                - /url: "#skills"
                        - listitem [ref=e515]:
                            - link "Contato" [ref=e516]:
                                - /url: "#contact"
                        - listitem [ref=e517]:
                            - link "Usado neste site" [ref=e518]:
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
                            - link "E-mail Profissional" [ref=e532]:
                                - /url: mailto:contato@rogeriodocarmo.com
                                - img [ref=e533]
                                - generic [ref=e536]: contato@rogeriodocarmo.com
                        - listitem [ref=e537]:
                            - link "Baixar currículo em formato PDF" [ref=e538]:
                                - /url: /resumes/resume.pdf
                                - img [ref=e539]
                                - generic [ref=e541]: Baixar Currículo
                        - listitem [ref=e542]:
                            - link "Baixar dissertação de mestrado em formato PDF" [ref=e543]:
                                - /url: /academic/masters_degree_dissertation_rogerio_do_carmo.pdf
                                - img [ref=e544]
                                - generic [ref=e546]: Baixar Dissertação
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
                            - button "Imprimir página do site" [ref=e563] [cursor=pointer]:
                                - img [ref=e564]
                                - generic [ref=e568]: Imprimir Página
            - paragraph [ref=e570]: © 2026 Rogério do Carmo. Todos os direitos reservados.
    - alert [ref=e571]
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
                - link "Política de Privacidade" [ref=e596]:
                    - /url: /privacy
                - text: e
                - link "Política de Cookies" [ref=e597]:
                    - /url: /cookies
```

# Test source

```ts
  70  |
  71  |   test.describe("Accept all flow", () => {
  72  |     test("should hide banner after accepting", async ({ page }) => {
  73  |       await page.goto("/");
  74  |
  75  |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  76  |       await expect(banner).toBeVisible();
  77  |
  78  |       // Click Accept All button
  79  |       await banner.getByRole("button", { name: /aceitar|accept/i }).click();
  80  |
  81  |       // Wait for page reload (accept triggers reload)
  82  |       await page.waitForLoadState("networkidle");
  83  |
  84  |       // Banner should not be visible after reload
  85  |       await expect(banner).not.toBeVisible();
  86  |     });
  87  |
  88  |     test("should persist consent across page reloads", async ({ page }) => {
  89  |       await page.goto("/");
  90  |
  91  |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  92  |       await banner.getByRole("button", { name: /aceitar|accept/i }).click();
  93  |
  94  |       // Wait for reload
  95  |       await page.waitForLoadState("networkidle");
  96  |
  97  |       // Check localStorage
  98  |       const consentStatus = await page.evaluate(() => localStorage.getItem("cookie-consent"));
  99  |       expect(consentStatus).toBe("accepted");
  100 |
  101 |       const preferences = await page.evaluate(() =>
  102 |         JSON.parse(localStorage.getItem("cookie-preferences") || "{}")
  103 |       );
  104 |       expect(preferences.analytics).toBe(true);
  105 |       expect(preferences.functional).toBe(true);
  106 |
  107 |       // Reload page manually
  108 |       await page.reload();
  109 |
  110 |       // Banner should still not be visible
  111 |       await expect(banner).not.toBeVisible();
  112 |     });
  113 |
  114 |     test("should enable Firebase Analytics after accepting", async ({ page }) => {
  115 |       await page.goto("/");
  116 |
  117 |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  118 |       await banner.getByRole("button", { name: /aceitar|accept/i }).click();
  119 |
  120 |       // Wait for reload
  121 |       await page.waitForLoadState("networkidle");
  122 |
  123 |       // Check that analytics consent is granted
  124 |       const hasConsent = await page.evaluate(() => {
  125 |         const status = localStorage.getItem("cookie-consent");
  126 |         return status === "accepted";
  127 |       });
  128 |       expect(hasConsent).toBe(true);
  129 |     });
  130 |   });
  131 |
  132 |   test.describe("Reject non-essential flow", () => {
  133 |     test("should hide banner after rejecting", async ({ page }) => {
  134 |       await page.goto("/");
  135 |
  136 |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  137 |       await expect(banner).toBeVisible();
  138 |
  139 |       // Click Reject button
  140 |       await banner.getByRole("button", { name: /rejeitar|reject/i }).click();
  141 |
  142 |       // Banner should hide immediately (no reload for reject)
  143 |       await expect(banner).not.toBeVisible();
  144 |     });
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
> 170 |       await page.goto("/");
      |                  ^ Error: page.goto: Navigation to "http://localhost:3000/" is interrupted by another navigation to "http://localhost:3000/pt-BR/"
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
  245 |       await expect(functionalCheckbox).toBeChecked();
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
```
