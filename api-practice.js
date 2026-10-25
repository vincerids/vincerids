/*
  ===== ЗАДАЧА: Тренды на крипторынке (CoinGecko) через fetch =====

  API: CoinGecko (публичный, без ключа)
  Эндпоинт: https://api.coingecko.com/api/v3/search/trending

  Что нужно сделать:
  1. Получить данные о трендовых активах.
  2. Извлечь список монет и вывести в консоль их названия (name) и символы (symbol).
  3. Вывести общее количество трендовых монет в ответе.
*/

async function loadTrendingAssets() {
  try {
    // Запрашиваем данные
    const response = await fetch("https://api.coingecko.com/api/v3/search/trending");
        
    // fetch не падает при ошибках 404/500, нужно проверять вручную
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    // Преобразуем поток данных в объект
    const data = await response.json();

    // Форматируем массив объектов токенов, оставляя нужную нам информацию
    const coinsList = data.coins.map(coin => ({
      name: coin.item.name,
      symbol: coin.item.symbol
    }));

    // Достаем значения объектов из массива и преобразуем его в строку
    const formattedNames = coinsList.map(coin => `${coin.name} (${coin.symbol})`).join(', ');

    // Возвращаем результат
    return `В последнее время ${coinsList.length} токенов в тренде. Их полный список: ${formattedNames}`;
        
  } catch (error) {
    // Ловит и ошибки сети, и ошибки парсинга JSON, и наши выброшенные ошибки
    console.error('Ошибка при загрузке данных:', error.message);
    return null;
  }
}

loadTrendingAssets().then(response => console.log(response));

/*
  ===== ЗАДАЧА: Анализ погоды через API =====

  API: Open-Meteo
  Эндпоинт: https://api.open-meteo.com/v1/forecast?latitude=55.75&longitude=37.62&hourly=temperature_2m&forecast_days=1

  Что нужно сделать:
  1. Получить данные о погоде на сегодня.
  2. Вычислить среднюю температуру за день.
  3. Найти все часы, когда температура была выше 15°C.
  4. Вывести в консоль результат.
  5. Обработать возможные ошибки сети.
*/

const axios = require('axios')

async function averageTemp(){
  // Запрашиваем данные и сразу же обрабатываем ошибки через catch()
  const dayInfo = await axios('https://api.open-meteo.com/v1/forecast?latitude=55.75&longitude=37.62&hourly=temperature_2m&forecast_days=1')
    .catch(error => {
      console.log('Ошибка: ', error);
      return null
    })
  
  // Достаем нужные массивы
  const temps = dayInfo.data.hourly.temperature_2m
  const times = dayInfo.data.hourly.time

  // Вычисляем среднюю температуру через reduce
  // (Сумма всех температур деленная на количество элементов)
  const avgDayTemp = temps
    .reduce((acc, temp) =>  acc + temp, 0) / temps.length

  // Задаем порог теплой погоды
  const warmCriteria = 15

  // Находим время, когда температура была выше пороговой
  // Используем index, чтобы связать массив времени и массив температур.
  // (Нижнее подчеркивание _ означает, что сам элемент времени нам тут не нужен, только его индекс)
  const warmHours = times
    .filter((_, index) => temps[index] > warmCriteria)

  // Форматируем время для красивого вывода (например, "14, 15, 16")
  const formatDate = warmHours
    .map(a => new Date(a).getHours())

  // Возвращаем результат в зависимости от того, были ли теплые часы
  if (warmHours.length > 0) return `Средняя температура на сегодня ${avgDayTemp.toFixed(1)}°C. Теплой погода была в ${formatDate.join(', ')} часах по Московскому времени.`
return `Средняя температура на сегодня ${avgDayTemp.toFixed(1)}°C. Температура воздуха не достигла отметки ${warmCriteria}°C.`
}

averageTemp().then(response => console.log(response))
