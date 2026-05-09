# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: email-subscribe.spec.ts >> EmailSubscribeForm - main page >> shows validation error for empty submission
- Location: tests/e2e/email-subscribe.spec.ts:23:7

# Error details

```
TimeoutError: locator.click: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('#contact').locator('button[type="submit"]')
    - locator resolved to <button type="submit" aria-busy="false" class="inline-flex items-center justify-center rounded-md bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-500 dark:hover:bg-primary-600">Send Message</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800 sm:p-8">…</div> from <div role="dialog" aria-modal="true" aria-labelledby="cookie-consent-title" class="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">…</div> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div class="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800 sm:p-8">…</div> from <div role="dialog" aria-modal="true" aria-labelledby="cookie-consent-title" class="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">…</div> subtree intercepts pointer events
  - retrying click action
    - waiting 100ms
    - waiting for element to be visible, enabled and stable
    - element is not stable
  - retrying click action
    - waiting 100ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Analytics Cookies</p> from <div role="dialog" aria-modal="true" aria-labelledby="cookie-consent-title" class="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 500ms
    4 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800 sm:p-8">…</div> from <div role="dialog" aria-modal="true" aria-labelledby="cookie-consent-title" class="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 500ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Analytics Cookies</p> from <div role="dialog" aria-modal="true" aria-labelledby="cookie-consent-title" class="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 500ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div role="dialog" aria-modal="true" aria-labelledby="cookie-consent-title" class="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">…</div> intercepts pointer events
    - retrying click action
      - waiting 500ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div role="dialog" aria-modal="true" aria-labelledby="cookie-consent-title" class="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">…</div> intercepts pointer events
    - retrying click action
      - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div class="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800 sm:p-8">…</div> from <div role="dialog" aria-modal="true" aria-labelledby="cookie-consent-title" class="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">…</div> subtree intercepts pointer events
  - retrying click action
    - waiting 500ms

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
    - banner [ref=e2]:
        - generic [ref=e4]:
            - button "Open menu" [ref=e5] [cursor=pointer]
            - generic [ref=e10]:
                - link "Linktree profile" [ref=e11]:
                    - /url: https://linktr.ee/rogeriodocarmo
                    - img [ref=e12]
                - generic [ref=e14]:
                    - generic [ref=e15]: Select language
                    - generic [ref=e16]: 🇺🇸
                    - combobox "Select language" [ref=e17] [cursor=pointer]:
                        - option "🇧🇷 Português (BR)"
                        - option "🇺🇸 English" [selected]
                        - option "🇪🇸 Español"
                    - generic: ▾
                - button "Switch to dark mode" [ref=e18] [cursor=pointer]:
                    - img "Moon" [ref=e19]: 🌙
    - main [ref=e20]:
        - region "Hero section" [ref=e22]:
            - generic [ref=e23]:
                - generic [ref=e24]:
                    - paragraph [ref=e25]: Hello, I'm
                    - heading "Rogério do Carmo" [level=1] [ref=e26]
                    - paragraph [ref=e27]: Frontend Mobile React Native Developer
                    - generic [ref=e28]:
                        - img "UNESP Logo" [ref=e29]
                        - generic [ref=e30]:
                            - paragraph [ref=e31]: Bachelor in Computer Science
                            - paragraph [ref=e32]: Master in Cartographic Sciences
                            - paragraph [ref=e33]: UNESP
                    - generic [ref=e34]:
                        - paragraph [ref=e35]: Complete master's dissertation
                        - link "Evaluation of GNSS measurement quality and positioning in Android smartphones" [ref=e37]:
                            - /url: http://hdl.handle.net/11449/243430
                            - img [ref=e38]
                            - text: Evaluation of GNSS measurement quality and positioning in Android smartphones
                        - link "Download master's dissertation in PDF" [ref=e43]:
                            - /url: /academic/masters_degree_dissertation_rogerio_do_carmo.pdf
                            - img [ref=e44]
                            - generic [ref=e46]: Download Dissertation (PDF)
                    - generic [ref=e47]:
                        - img "Company Logo" [ref=e48]
                        - generic [ref=e49]:
                            - paragraph [ref=e50]: Senior Mobile Developer
                            - paragraph [ref=e51]: Current
                    - generic [ref=e52]:
                        - link "View My Work" [ref=e53]:
                            - /url: "#projects"
                        - link "Get in Touch" [ref=e54]:
                            - /url: mailto:contact@rogeriodocarmo.com
                            - img [ref=e55]
                            - text: Get in Touch
                    - paragraph [ref=e58]:
                        - link "contact@rogeriodocarmo.com" [ref=e59]:
                            - /url: mailto:contact@rogeriodocarmo.com
                - img "Rogério do Carmo — Mobile React Native Developer" [ref=e62]
        - tablist "Choose a Path" [ref=e65]:
            - generic [ref=e66]:
                - tab "Professional" [selected] [ref=e67] [cursor=pointer]:
                    - img [ref=e68]
                    - text: Professional
                - tab "Academic" [ref=e70] [cursor=pointer]:
                    - img [ref=e71]
                    - text: Academic
        - region "Professional Experience experience" [ref=e76]:
            - generic [ref=e77]:
                - heading "Professional Experience" [level=2] [ref=e78]
                - generic [ref=e79]:
                    - article [ref=e80]:
                        - generic [ref=e81]:
                            - generic [ref=e82]:
                                - heading "Desenvolvedor Mobile React Native" [level=3] [ref=e83]
                                - paragraph [ref=e84]: Topaz · Remoto, Brasil
                                - paragraph [ref=e85]: Feb 2023 – Present · 3 yrs 3 mo
                            - button "Expand details" [ref=e86] [cursor=pointer]:
                                - img [ref=e87]
                        - paragraph [ref=e89]: "Atuação no produto interno da empresa, voltado ao setor bancário. Desenvolvimento e manutenção de aplicativos móveis para instituições financeiras, com foco em funcionalidades críticas e experiência do usuário. ### Conquistas - Desenvolveu e implementou módulo Pix completo para aplicativos bancários, incluindo integração com DICT (Diretório de Identificadores de Contas Transacionais) - Implementou Login Biométrico com integração Daon para autenticação segura - Criou módulo de Empréstimo com fluxo completo de solicitação e aprovação - Prestou manutenção e correção de bugs em aplicativos bancários críticos - Atuou em projetos para clientes específicos: CrediSIS (Brasil), Bradescard (México), Banco Macro (Argentina) e Banco do Nordeste - BNB (Brasil) - Trabalhou com Google Play Console, Apple Developer e TestFlight para distribuição de apps - Implementou testes unitários com Jest para garantir qualidade do código - Utilizou ferramentas de monitoramento (Elastic, Kibana, Grafana) para análise de performance - Experiência com metodologias ágeis e comunicação eficiente com stakeholders (POs, BAs, QAs, SMs) - Orientação de desenvolvedores júnior em boas práticas de desenvolvimento React Native"
                    - article [ref=e90]:
                        - generic [ref=e91]:
                            - generic [ref=e92]:
                                - heading "Desenvolvedor Flutter" [level=3] [ref=e93]
                                - paragraph [ref=e94]: Rubcube · Remoto, Brasil
                                - paragraph [ref=e95]: Oct 2021 – Jan 2022 · 3 mo
                            - button "Expand details" [ref=e96] [cursor=pointer]:
                                - img [ref=e97]
                        - paragraph [ref=e99]: "Atuação no aplicativo móvel do cliente Virtus Pay, focando em manutenção e qualidade do código. ### Conquistas - Efetuou manutenção e correções de bugs no aplicativo Virtus Pay - Trabalhou com Flutter para desenvolvimento multiplataforma - Experiência com aplicativos de pagamento digital"
                    - article [ref=e100]:
                        - generic [ref=e101]:
                            - generic [ref=e102]:
                                - heading "Desenvolvedor Mobile React Native" [level=3] [ref=e103]
                                - paragraph [ref=e104]: Rubcube · Remoto, Brasil
                                - paragraph [ref=e105]: Jan 2022 – Mar 2023 · 1 yr 2 mo
                            - button "Expand details" [ref=e106] [cursor=pointer]:
                                - img [ref=e107]
                        - paragraph [ref=e109]: "Atuação no desenvolvimento do aplicativo móvel do cliente Banco Digi+, com foco em funcionalidades bancárias e experiência do usuário. ### Conquistas - Criou módulo Pix completo do zero para o Banco Digi+, incluindo todas as funcionalidades de transferência e pagamento - Efetuou manutenção e correções de bugs no aplicativo bancário - Trabalhou com MongoDB para persistência de dados - Desenvolveu componentes React Native em formato funcional e de classes - Desenvolveu website da empresa utilizando React JS - Experiência com integração de APIs REST para serviços bancários"
                    - article [ref=e110]:
                        - generic [ref=e111]:
                            - generic [ref=e112]:
                                - heading "Desenvolvedor Android/Flutter" [level=3] [ref=e113]
                                - paragraph [ref=e114]: Engeselt · Remoto, Brasil
                                - paragraph [ref=e115]: Apr 2021 – Oct 2021 · 6 mo
                            - button "Expand details" [ref=e116] [cursor=pointer]:
                                - img [ref=e117]
                        - paragraph [ref=e119]: "Entrada na empresa para efetuar prova de conceito do mestrado sobre dados GNSS (GPS). Após conclusão, permaneceu na empresa para atuação em produtos próprios do setor elétrico. ### Conquistas - Desenvolveu prova de conceito utilizando dados GNSS (GPS) do mestrado - Efetuou manutenção e correções de bugs no aplicativo da empresa do setor elétrico - Trabalhou com Flutter MobX para gerenciamento de estado - Implementou funcionalidades offline-first com SQFlite e OpenStreetMaps - Desenvolveu em Android Nativo utilizando Java e XML - Aplicou conhecimentos acadêmicos de GNSS em aplicações práticas"
                - generic [ref=e121]:
                    - heading "Timeline" [level=3] [ref=e122]
                    - list "Timeline" [ref=e123]:
                        - listitem [ref=e125]:
                            - generic "Work" [ref=e126]:
                                - generic [ref=e127]: Work
                            - time [ref=e128]: Feb 2023 – Present · 3 yrs 3 mo
                            - generic [ref=e129]:
                                - heading "Desenvolvedor Mobile React Native" [level=3] [ref=e130]
                                - paragraph [ref=e131]: Topaz · Remoto, Brasil
                                - paragraph [ref=e132]: "Atuação no produto interno da empresa, voltado ao setor bancário. Desenvolvimento e manutenção de aplicativos móveis para instituições financeiras, com foco em funcionalidades críticas e experiência do usuário. ### Conquistas - Desenvolveu e implementou módulo Pix completo para aplicativos bancários, incluindo integração com DICT (Diretório de Identificadores de Contas Transacionais) - Implementou Login Biométrico com integração Daon para autenticação segura - Criou módulo de Empréstimo com fluxo completo de solicitação e aprovação - Prestou manutenção e correção de bugs em aplicativos bancários críticos - Atuou em projetos para clientes específicos: CrediSIS (Brasil), Bradescard (México), Banco Macro (Argentina) e Banco do Nordeste - BNB (Brasil) - Trabalhou com Google Play Console, Apple Developer e TestFlight para distribuição de apps - Implementou testes unitários com Jest para garantir qualidade do código - Utilizou ferramentas de monitoramento (Elastic, Kibana, Grafana) para análise de performance - Experiência com metodologias ágeis e comunicação eficiente com stakeholders (POs, BAs, QAs, SMs) - Orientação de desenvolvedores júnior em boas práticas de desenvolvimento React Native"
                        - listitem [ref=e133]:
                            - generic "Work" [ref=e134]:
                                - generic [ref=e135]: Work
                            - time [ref=e136]: Oct 2021 – Jan 2022 · 3 mo
                            - generic [ref=e137]:
                                - heading "Desenvolvedor Flutter" [level=3] [ref=e138]
                                - paragraph [ref=e139]: Rubcube · Remoto, Brasil
                                - paragraph [ref=e140]: "Atuação no aplicativo móvel do cliente Virtus Pay, focando em manutenção e qualidade do código. ### Conquistas - Efetuou manutenção e correções de bugs no aplicativo Virtus Pay - Trabalhou com Flutter para desenvolvimento multiplataforma - Experiência com aplicativos de pagamento digital"
                        - listitem [ref=e141]:
                            - generic "Work" [ref=e142]:
                                - generic [ref=e143]: Work
                            - time [ref=e144]: Jan 2022 – Mar 2023 · 1 yr 2 mo
                            - generic [ref=e145]:
                                - heading "Desenvolvedor Mobile React Native" [level=3] [ref=e146]
                                - paragraph [ref=e147]: Rubcube · Remoto, Brasil
                                - paragraph [ref=e148]: "Atuação no desenvolvimento do aplicativo móvel do cliente Banco Digi+, com foco em funcionalidades bancárias e experiência do usuário. ### Conquistas - Criou módulo Pix completo do zero para o Banco Digi+, incluindo todas as funcionalidades de transferência e pagamento - Efetuou manutenção e correções de bugs no aplicativo bancário - Trabalhou com MongoDB para persistência de dados - Desenvolveu componentes React Native em formato funcional e de classes - Desenvolveu website da empresa utilizando React JS - Experiência com integração de APIs REST para serviços bancários"
                        - listitem [ref=e149]:
                            - generic "Work" [ref=e150]:
                                - generic [ref=e151]: Work
                            - time [ref=e152]: Apr 2021 – Oct 2021 · 6 mo
                            - generic [ref=e153]:
                                - heading "Desenvolvedor Android/Flutter" [level=3] [ref=e154]
                                - paragraph [ref=e155]: Engeselt · Remoto, Brasil
                                - paragraph [ref=e156]: "Entrada na empresa para efetuar prova de conceito do mestrado sobre dados GNSS (GPS). Após conclusão, permaneceu na empresa para atuação em produtos próprios do setor elétrico. ### Conquistas - Desenvolveu prova de conceito utilizando dados GNSS (GPS) do mestrado - Efetuou manutenção e correções de bugs no aplicativo da empresa do setor elétrico - Trabalhou com Flutter MobX para gerenciamento de estado - Implementou funcionalidades offline-first com SQFlite e OpenStreetMaps - Desenvolveu em Android Nativo utilizando Java e XML - Aplicou conhecimentos acadêmicos de GNSS em aplicações práticas"
        - region "Skills" [ref=e158]:
            - generic [ref=e159]:
                - heading "Skills" [level=2] [ref=e160]
                - generic [ref=e161]:
                    - generic [ref=e162]: Filter skills
                    - searchbox "Filter skills by name" [ref=e163]
                - generic [ref=e164]:
                    - generic [ref=e165]:
                        - heading "Mobile Development" [level=2] [ref=e166]
                        - list "Mobile Development skills" [ref=e167]:
                            - listitem [ref=e168]:
                                - generic [ref=e169]: React Native
                                - 'generic "Level: expert" [ref=e170]': expert
                            - listitem [ref=e171]:
                                - generic [ref=e172]: Flutter
                                - 'generic "Level: intermediate" [ref=e173]': intermediate
                            - listitem [ref=e174]:
                                - generic [ref=e175]: Android Nativo (Java)
                                - 'generic "Level: advanced" [ref=e176]': advanced
                            - listitem [ref=e177]:
                                - generic [ref=e178]: TypeScript
                                - 'generic "Level: advanced" [ref=e179]': advanced
                            - listitem [ref=e180]:
                                - generic [ref=e181]: JavaScript
                                - 'generic "Level: expert" [ref=e182]': expert
                    - generic [ref=e183]:
                        - heading "State Management & Architecture" [level=2] [ref=e184]
                        - list "State Management & Architecture skills" [ref=e185]:
                            - listitem [ref=e186]:
                                - generic [ref=e187]: Redux/Saga
                                - 'generic "Level: advanced" [ref=e188]': advanced
                            - listitem [ref=e189]:
                                - generic [ref=e190]: Jotai
                                - 'generic "Level: intermediate" [ref=e191]': intermediate
                            - listitem [ref=e192]:
                                - generic [ref=e193]: TankStack
                                - 'generic "Level: intermediate" [ref=e194]': intermediate
                            - listitem [ref=e195]:
                                - generic [ref=e196]: MobX
                                - 'generic "Level: intermediate" [ref=e197]': intermediate
                    - generic [ref=e198]:
                        - heading "UI & Styling" [level=2] [ref=e199]
                        - list "UI & Styling skills" [ref=e200]:
                            - listitem [ref=e201]:
                                - generic [ref=e202]: React Native StyleSheet
                                - 'generic "Level: expert" [ref=e203]': expert
                            - listitem [ref=e204]:
                                - generic [ref=e205]: Styled Components
                                - 'generic "Level: advanced" [ref=e206]': advanced
                            - listitem [ref=e207]:
                                - generic [ref=e208]: React JS
                                - 'generic "Level: advanced" [ref=e209]': advanced
                    - generic [ref=e210]:
                        - heading "Forms & Validation" [level=2] [ref=e211]
                        - list "Forms & Validation skills" [ref=e212]:
                            - listitem [ref=e213]:
                                - generic [ref=e214]: react-hook-form
                                - 'generic "Level: advanced" [ref=e215]': advanced
                            - listitem [ref=e216]:
                                - generic [ref=e217]: Validação de Formulários
                                - 'generic "Level: expert" [ref=e218]': expert
                    - generic [ref=e219]:
                        - heading "Testing" [level=2] [ref=e220]
                        - list "Testing skills" [ref=e221]:
                            - listitem [ref=e222]:
                                - generic [ref=e223]: Jest
                                - 'generic "Level: advanced" [ref=e224]': advanced
                            - listitem [ref=e225]:
                                - generic [ref=e226]: Testes Unitários
                                - 'generic "Level: advanced" [ref=e227]': advanced
                    - generic [ref=e228]:
                        - heading "Firebase & Cloud Services" [level=2] [ref=e229]
                        - list "Firebase & Cloud Services skills" [ref=e230]:
                            - listitem [ref=e231]:
                                - generic [ref=e232]: Firebase Analytics
                                - 'generic "Level: advanced" [ref=e233]': advanced
                            - listitem [ref=e234]:
                                - generic [ref=e235]: Firebase Crashlytics
                                - 'generic "Level: advanced" [ref=e236]': advanced
                            - listitem [ref=e237]:
                                - generic [ref=e238]: Firebase Distribution
                                - 'generic "Level: intermediate" [ref=e239]': intermediate
                            - listitem [ref=e240]:
                                - generic [ref=e241]: Firebase Storage
                                - 'generic "Level: intermediate" [ref=e242]': intermediate
                    - generic [ref=e243]:
                        - heading "APIs & Integration" [level=2] [ref=e244]
                        - list "APIs & Integration skills" [ref=e245]:
                            - listitem [ref=e246]:
                                - generic [ref=e247]: REST APIs
                                - 'generic "Level: expert" [ref=e248]': expert
                            - listitem [ref=e249]:
                                - generic [ref=e250]: AsyncStorage
                                - 'generic "Level: expert" [ref=e251]': expert
                            - listitem [ref=e252]:
                                - generic [ref=e253]: MongoDB
                                - 'generic "Level: intermediate" [ref=e254]': intermediate
                    - generic [ref=e255]:
                        - heading "Internationalization" [level=2] [ref=e256]
                        - list "Internationalization skills" [ref=e257]:
                            - listitem [ref=e258]:
                                - generic [ref=e259]: i18next
                                - 'generic "Level: advanced" [ref=e260]': advanced
                            - listitem [ref=e261]:
                                - generic [ref=e262]: Localização de Apps
                                - 'generic "Level: advanced" [ref=e263]': advanced
                    - generic [ref=e264]:
                        - heading "Native Modules & Integrations" [level=2] [ref=e265]
                        - list "Native Modules & Integrations skills" [ref=e266]:
                            - listitem [ref=e267]:
                                - generic [ref=e268]: Expo Modules
                                - 'generic "Level: intermediate" [ref=e269]': intermediate
                            - listitem [ref=e270]:
                                - generic [ref=e271]: Daon (Biometria)
                                - 'generic "Level: intermediate" [ref=e272]': intermediate
                            - listitem [ref=e273]:
                                - generic [ref=e274]: Qualtrics
                                - 'generic "Level: intermediate" [ref=e275]': intermediate
                    - generic [ref=e276]:
                        - heading "Database & Storage" [level=2] [ref=e277]
                        - list "Database & Storage skills" [ref=e278]:
                            - listitem [ref=e279]:
                                - generic [ref=e280]: SQFlite
                                - 'generic "Level: intermediate" [ref=e281]': intermediate
                            - listitem [ref=e282]:
                                - generic [ref=e283]: AsyncStorage
                                - 'generic "Level: expert" [ref=e284]': expert
                            - listitem [ref=e285]:
                                - generic [ref=e286]: MongoDB
                                - 'generic "Level: intermediate" [ref=e287]': intermediate
                    - generic [ref=e288]:
                        - heading "Maps & Location" [level=2] [ref=e289]
                        - list "Maps & Location skills" [ref=e290]:
                            - listitem [ref=e291]:
                                - generic [ref=e292]: OpenStreetMaps
                                - 'generic "Level: intermediate" [ref=e293]': intermediate
                            - listitem [ref=e294]:
                                - generic [ref=e295]: GNSS/GPS
                                - 'generic "Level: expert" [ref=e296]': expert
                            - listitem [ref=e297]:
                                - generic [ref=e298]: Geolocalização
                                - 'generic "Level: advanced" [ref=e299]': advanced
                    - generic [ref=e300]:
                        - heading "DevOps & CI/CD" [level=2] [ref=e301]
                        - list "DevOps & CI/CD skills" [ref=e302]:
                            - listitem [ref=e303]:
                                - generic [ref=e304]: Google Play Console
                                - 'generic "Level: advanced" [ref=e305]': advanced
                            - listitem [ref=e306]:
                                - generic [ref=e307]: Apple Developer
                                - 'generic "Level: advanced" [ref=e308]': advanced
                            - listitem [ref=e309]:
                                - generic [ref=e310]: TestFlight
                                - 'generic "Level: advanced" [ref=e311]': advanced
                            - listitem [ref=e312]:
                                - generic [ref=e313]: Jenkins
                                - 'generic "Level: intermediate" [ref=e314]': intermediate
                            - listitem [ref=e315]:
                                - generic [ref=e316]: Fastlane
                                - 'generic "Level: intermediate" [ref=e317]': intermediate
                            - listitem [ref=e318]:
                                - generic [ref=e319]: Git/GitHub/GitLab
                                - 'generic "Level: expert" [ref=e320]': expert
                    - generic [ref=e321]:
                        - heading "Monitoring & Analytics" [level=2] [ref=e322]
                        - list "Monitoring & Analytics skills" [ref=e323]:
                            - listitem [ref=e324]:
                                - generic [ref=e325]: Elastic
                                - 'generic "Level: intermediate" [ref=e326]': intermediate
                            - listitem [ref=e327]:
                                - generic [ref=e328]: Kibana
                                - 'generic "Level: intermediate" [ref=e329]': intermediate
                            - listitem [ref=e330]:
                                - generic [ref=e331]: Grafana
                                - 'generic "Level: intermediate" [ref=e332]': intermediate
                    - generic [ref=e333]:
                        - heading "Project Management" [level=2] [ref=e334]
                        - list "Project Management skills" [ref=e335]:
                            - listitem [ref=e336]:
                                - generic [ref=e337]: Jira
                                - 'generic "Level: advanced" [ref=e338]': advanced
                            - listitem [ref=e339]:
                                - generic [ref=e340]: Confluence
                                - 'generic "Level: intermediate" [ref=e341]': intermediate
                            - listitem [ref=e342]:
                                - generic [ref=e343]: Metodologias Ágeis
                                - 'generic "Level: advanced" [ref=e344]': advanced
                    - generic [ref=e345]:
                        - heading "Backend & Desktop" [level=2] [ref=e346]
                        - list "Backend & Desktop skills" [ref=e347]:
                            - listitem [ref=e348]:
                                - generic [ref=e349]: Java
                                - 'generic "Level: advanced" [ref=e350]': advanced
                            - listitem [ref=e351]:
                                - generic [ref=e352]: Java Swing
                                - 'generic "Level: intermediate" [ref=e353]': intermediate
                            - listitem [ref=e354]:
                                - generic [ref=e355]: Python
                                - 'generic "Level: intermediate" [ref=e356]': intermediate
                            - listitem [ref=e357]:
                                - generic [ref=e358]: C++
                                - 'generic "Level: intermediate" [ref=e359]': intermediate
                    - generic [ref=e360]:
                        - heading "Domain Knowledge" [level=2] [ref=e361]
                        - list "Domain Knowledge skills" [ref=e362]:
                            - listitem [ref=e363]:
                                - generic [ref=e364]: Sistema Pix (DICT)
                                - 'generic "Level: expert" [ref=e365]': expert
                            - listitem [ref=e366]:
                                - generic [ref=e367]: Aplicações Bancárias
                                - 'generic "Level: expert" [ref=e368]': expert
                            - listitem [ref=e369]:
                                - generic [ref=e370]: Biometria e Autenticação
                                - 'generic "Level: advanced" [ref=e371]': advanced
                            - listitem [ref=e372]:
                                - generic [ref=e373]: Processamento de Imagens
                                - 'generic "Level: intermediate" [ref=e374]': intermediate
                            - listitem [ref=e375]:
                                - generic [ref=e376]: Ciências Cartográficas
                                - 'generic "Level: advanced" [ref=e377]': advanced
                    - generic [ref=e378]:
                        - heading "Languages" [level=2] [ref=e379]
                        - list "Languages skills" [ref=e380]:
                            - listitem [ref=e381]:
                                - generic [ref=e382]: Português (Nativo)
                                - 'generic "Level: expert" [ref=e383]': expert
                            - listitem [ref=e384]:
                                - generic [ref=e385]: Inglês (Intermediário-Avançado B2)
                                - 'generic "Level: advanced" [ref=e386]': advanced
                    - generic [ref=e387]:
                        - heading "Soft Skills" [level=2] [ref=e388]
                        - list "Soft Skills skills" [ref=e389]:
                            - listitem [ref=e390]:
                                - generic [ref=e391]: Comunicação com Stakeholders
                                - 'generic "Level: expert" [ref=e392]': expert
                            - listitem [ref=e393]:
                                - generic [ref=e394]: Orientação de Desenvolvedores
                                - 'generic "Level: advanced" [ref=e395]': advanced
                            - listitem [ref=e396]:
                                - generic [ref=e397]: Trabalho em Equipe
                                - 'generic "Level: expert" [ref=e398]': expert
                            - listitem [ref=e399]:
                                - generic [ref=e400]: Resolução de Problemas
                                - 'generic "Level: expert" [ref=e401]': expert
                            - listitem [ref=e402]:
                                - generic [ref=e403]: Metodologias Ágeis
                                - 'generic "Level: advanced" [ref=e404]': advanced
        - region "Projects" [ref=e406]:
            - generic [ref=e407]:
                - heading "Projects" [level=2] [ref=e408]
                - group "Filter by technology" [ref=e409]:
                    - button "All" [pressed] [ref=e410] [cursor=pointer]
                    - button "Android Architecture Components" [ref=e411] [cursor=pointer]
                    - button "Android SDK" [ref=e412] [cursor=pointer]
                    - button "Data Processing" [ref=e413] [cursor=pointer]
                    - button "Firebase Analytics" [ref=e414] [cursor=pointer]
                    - button "Firebase Crashlytics" [ref=e415] [cursor=pointer]
                    - button "GNSS/GPS" [ref=e416] [cursor=pointer]
                    - button "Java" [ref=e417] [cursor=pointer]
                    - button "Jest" [ref=e418] [cursor=pointer]
                    - button "Material Design" [ref=e419] [cursor=pointer]
                    - button "NMEA Protocol" [ref=e420] [cursor=pointer]
                    - button "Next.js 16" [ref=e421] [cursor=pointer]
                    - button "Playwright" [ref=e422] [cursor=pointer]
                    - button "SQLite" [ref=e423] [cursor=pointer]
                    - button "Scientific Computing" [ref=e424] [cursor=pointer]
                    - button "Sentry" [ref=e425] [cursor=pointer]
                    - button "Tailwind CSS" [ref=e426] [cursor=pointer]
                    - button "TypeScript" [ref=e427] [cursor=pointer]
                    - button "Vercel" [ref=e428] [cursor=pointer]
                    - button "next-intl" [ref=e429] [cursor=pointer]
                - generic [ref=e430]:
                    - button "View details for Personal Resume Website" [ref=e432] [cursor=pointer]:
                        - img "Personal Resume Website screenshot 1" [ref=e434]
                        - generic [ref=e435]:
                            - heading "Personal Resume Website" [level=3] [ref=e436]
                            - generic [ref=e438]: Featured
                        - paragraph [ref=e439]: Site de currículo pessoal moderno e responsivo com suporte multilíngue, modo escuro, e integração completa com Firebase Analytics
                        - generic [ref=e440]:
                            - generic [ref=e441]: Next.js 16
                            - generic [ref=e442]: TypeScript
                            - generic [ref=e443]: Tailwind CSS
                            - generic [ref=e444]: Firebase Analytics
                            - generic [ref=e445]: +6 more
                    - button "View details for Android Native Crud" [ref=e447] [cursor=pointer]:
                        - img "Android Native Crud screenshot 1" [ref=e449]
                        - heading "Android Native Crud" [level=3] [ref=e451]
                        - paragraph [ref=e452]: Aplicação de exemplo para estudo inicial do ambiente Android, explorando componentes fundamentais e padrões de desenvolvimento
                        - generic [ref=e453]:
                            - generic [ref=e454]: Java
                            - generic [ref=e455]: Android SDK
                            - generic [ref=e456]: Material Design
                            - generic [ref=e457]: SQLite
                            - generic [ref=e458]: +1 more
                    - button "View details for INCT GNSS App" [ref=e460] [cursor=pointer]:
                        - img "INCT GNSS App screenshot 1" [ref=e462]
                        - generic [ref=e463]:
                            - heading "INCT GNSS App" [level=3] [ref=e464]
                            - generic [ref=e466]: Featured
                        - paragraph [ref=e467]: Aplicação Android para análise de dados GNSS (GPS) coletados pelo Google GNSSLogger, com processamento de medições NMEA
                        - generic [ref=e468]:
                            - generic [ref=e469]: Java
                            - generic [ref=e470]: Android SDK
                            - generic [ref=e471]: GNSS/GPS
                            - generic [ref=e472]: NMEA Protocol
                            - generic [ref=e473]: +2 more
        - region "Get in Touch" [ref=e474]:
            - generic [ref=e475]:
                - heading "Get in Touch" [level=2] [ref=e476]
                - paragraph [ref=e477]: Have a project in mind or want to chat? Send me a message!
                - generic [ref=e479]:
                    - img [ref=e480]
                    - generic [ref=e483]:
                        - paragraph [ref=e484]: Professional Email
                        - link "contact@rogeriodocarmo.com" [ref=e485]:
                            - /url: mailto:contact@rogeriodocarmo.com
                        - paragraph [ref=e486]: Or use the form below to send me a message
                - form "Contact form" [ref=e487]:
                    - generic [ref=e488]:
                        - generic [ref=e489]: Name *
                        - textbox "Name" [ref=e490]:
                            - /placeholder: Your name
                    - generic [ref=e491]:
                        - generic [ref=e492]: Email *
                        - textbox "Email" [ref=e493]:
                            - /placeholder: your@email.com
                    - generic [ref=e494]:
                        - generic [ref=e495]: Message *
                        - textbox "Message" [ref=e496]:
                            - /placeholder: Your message (at least 10 characters)
                    - button "Send Message" [ref=e497] [cursor=pointer]
        - button "Back to top" [ref=e498] [cursor=pointer]:
            - generic [ref=e499]: ↑
    - contentinfo [ref=e500]:
        - generic [ref=e501]:
            - generic [ref=e502]:
                - generic [ref=e503]:
                    - heading "Navigate" [level=2] [ref=e504]
                    - list [ref=e505]:
                        - listitem [ref=e506]:
                            - link "Home" [ref=e507]:
                                - /url: "#home"
                        - listitem [ref=e508]:
                            - link "Projects" [ref=e509]:
                                - /url: "#projects"
                        - listitem [ref=e510]:
                            - link "Experience" [ref=e511]:
                                - /url: "#experience"
                        - listitem [ref=e512]:
                            - link "Skills" [ref=e513]:
                                - /url: "#skills"
                        - listitem [ref=e514]:
                            - link "Contact" [ref=e515]:
                                - /url: "#contact"
                        - listitem [ref=e516]:
                            - link "Used in this site" [ref=e517]:
                                - /url: "#tech-stack"
                - generic [ref=e518]:
                    - heading "Languages" [level=2] [ref=e519]
                    - list [ref=e520]:
                        - listitem [ref=e521]:
                            - link "Português (pt-BR)" [ref=e522]:
                                - /url: /pt-BR
                        - listitem [ref=e523]:
                            - link "English (en)" [ref=e524]:
                                - /url: /en
                        - listitem [ref=e525]:
                            - link "Español (es)" [ref=e526]:
                                - /url: /es
                - generic [ref=e527]:
                    - heading "Connect" [level=2] [ref=e528]
                    - list [ref=e529]:
                        - listitem [ref=e530]:
                            - link "Professional Email" [ref=e531]:
                                - /url: mailto:contact@rogeriodocarmo.com
                                - img [ref=e532]
                                - generic [ref=e535]: contact@rogeriodocarmo.com
                        - listitem [ref=e536]:
                            - link "Download resume in PDF format" [ref=e537]:
                                - /url: /resumes/resume.pdf
                                - img [ref=e538]
                                - generic [ref=e540]: Download Resume
                        - listitem [ref=e541]:
                            - link "Download master's dissertation in PDF format" [ref=e542]:
                                - /url: /academic/masters_degree_dissertation_rogerio_do_carmo.pdf
                                - img [ref=e543]
                                - generic [ref=e545]: Download Dissertation
                        - listitem [ref=e546]:
                            - link "Linktree profile" [ref=e547]:
                                - /url: https://linktr.ee/rogeriodocarmo
                                - img [ref=e548]
                                - generic [ref=e550]: Linktree
                        - listitem [ref=e551]:
                            - link "LinkedIn profile" [ref=e552]:
                                - /url: https://www.linkedin.com/in/rogeriodocarmo/
                                - img [ref=e553]
                                - generic [ref=e555]: LinkedIn
                        - listitem [ref=e556]:
                            - link "GitHub profile" [ref=e557]:
                                - /url: https://github.com/RogerioDoCarmo/curriculo
                                - img [ref=e558]
                                - generic [ref=e560]: GitHub
                        - listitem [ref=e561]:
                            - button "Print site page" [ref=e562] [cursor=pointer]:
                                - img [ref=e563]
                                - generic [ref=e567]: Print Page
            - paragraph [ref=e569]: © 2026 Rogério do Carmo. All rights reserved.
    - alert [ref=e570]
    - dialog "This site uses cookies" [ref=e571]:
        - generic [ref=e572]:
            - heading "This site uses cookies" [level=2] [ref=e573]
            - paragraph [ref=e574]: We use essential cookies for site functionality and analytics cookies to understand how you interact with our content. All analytics data is anonymous and does not include personal information.
            - generic [ref=e575]:
                - generic [ref=e576]:
                    - img [ref=e578]
                    - generic [ref=e580]:
                        - paragraph [ref=e581]: Essential Cookies
                        - paragraph [ref=e582]: Required for basic site functionality (theme, language, session). Always active.
                - generic [ref=e583]:
                    - img [ref=e585]
                    - generic [ref=e587]:
                        - paragraph [ref=e588]: Analytics Cookies
                        - paragraph [ref=e589]: Help understand how visitors interact with the site through Firebase Analytics. Anonymous data.
            - generic [ref=e590]:
                - button "Accept All" [ref=e591] [cursor=pointer]
                - button "Reject Non-Essential" [ref=e592] [cursor=pointer]
                - button "Customize" [ref=e593] [cursor=pointer]
            - paragraph [ref=e594]:
                - text: Learn more in our
                - link "Privacy Policy" [ref=e595]:
                    - /url: /privacy
                - text: and
                - link "Cookie Policy" [ref=e596]:
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
> 25  |     await section.locator('button[type="submit"]').click();
      |                                                    ^ TimeoutError: locator.click: Timeout 10000ms exceeded.
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
  86  |     await expect(modal).toBeVisible({ timeout: 2000 });
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
