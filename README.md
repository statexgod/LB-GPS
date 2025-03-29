# LB-GPS
Емулятор вимірювальної частини GPS надається у вигляді Docker image під назвою iperekrestov/university/gps-emulation-service. Щоб запустити емулятор, виконайте наступні кроки:  
1. Завантажте Docker image з Docker Hub:  
docker pull iperekrestov/university:gps-emulation-service
2. Запустіть Docker контейнер, використовуючи наступну команду:  
docker run --name gps-emulator -p 4001:4000 iperekrestov/university:gps-emulation-service

Для зчитування даних з емулятора необхідно підключитися до нього через WebSocket:  
wscat -c ws://localhost:4001

Застосунок підключається до WebSocket сервера і зчитує дані про положення супутників і об'єкта, відображає дані та положення супутників і об'єкта на графіку за допомогою бібліотеки Plotly.  
![GPS](https://github.com/MKroppp/LB-GPS/blob/main/Screenshots/1.png)  
![Код](https://github.com/MKroppp/LB-GPS/blob/main/Screenshots/2.png)  
![Код](https://github.com/MKroppp/LB-GPS/blob/main/Screenshots/3.png)  
![Код](https://github.com/MKroppp/LB-GPS/blob/main/Screenshots/4.png)  

У застосунку можна змінювати параметри вимірювальної частини GPS.  
![Update](https://github.com/MKroppp/LB-GPS/blob/main/Screenshots/6.png)  
![Код](https://github.com/MKroppp/LB-GPS/blob/main/Screenshots/5.png)  
