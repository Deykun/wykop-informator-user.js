# Informator

Skrypt wyświetla dodatkowe informacje o liczbie zgłoszeń i ich ocenie w serwisie **wykop.pl**, zapisuje też dane o powodach zgłoszeń i moderatorach którzy je rozpatrywali wyświetlając na ich podstawie statystyki.

![](http://x3.cdn03.imgwykop.pl/c3201142/comment_HyxPI4uj6ruDCLTeUPRezVGlKIAQk0diYUvLpEOdAZ8UDOgNbbQjZxOseNknNRYTHW47PAjmTxuVEMcqV1CJcTW4rn1WWusvfF03,w400.jpg)

### Panel zgłoszeń
W panelu zgłoszeń widoczne jest maksymalnie **50** ostatnich zgłoszeń z **ostatniego tygodnia** (reszta jest niewidoczna).

Same zgłoszenia mogą mieć **6** różnych statusów:
- **Prawidłowe** (na obrazku)
- **Nieprawidłowe**
- **Zmieniony powód**
- **W konsultacji**
- **Nowe**
- Rozpatrywane (w czasie rozpatrywania status się nie wyświetla)

Skrypt pobiera zgłoszenia z tabeli zapisując ich:
- powód (np. "*Nieprawidłowe tagi*, "*Atakuje mnie*" itp.)
- ID (na obrazku 7Lak)
- status (zostały opisane wyżej)
- kod moderatora (moderatorzy mają w panelu kody zamiast nicków)
 
Na podstawie zebranych informacji dodatek wyświetla w panelu odnośnik z informacją o tym ile jakiego typu zgłoszeń widoczne jest na stronie. Sam odnośnik prowadzi do strony ze statystykami dotyczącymi wszystkich zapisanych zgłoszęń (jest to nieistniejąca strona w serwisie która zwraca błąd 404, ale element ten jest zastępowany).

![](http://x3.cdn03.imgwykop.pl/c3201142/comment_QFBt6RZ2ybfjSTeVqlXmkZJ54AxGqnNu.jpg)

### Wcześniejsze wersje
Pierwsza wersja na GitHubie to 3.50, wcześniejsze znajdują sie w serwisie [GreasyFork](https://greasyfork.org/pl/scripts/1974-informator/versions).