/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/router'
export const TelegramContext = createContext({})
// docs: https://core.telegram.org/bots/webapps
// 用来获取在 Telegram WebApp 中的用户信息以及操作对象 Telegram WebApp，只在 Telegram WebApp 中有效
export const TelegramProvider = ({ location, children, tgWebAppData, setTgWebAppData }) => {
  const router = useRouter()
  const [webApp, setWebApp] = useState(null)
  const [initData, setInitData] = useState(null)
  const [isInTelegram, setIsInTelegram] = useState(false)

  let retryCount = 0
  // initData 是 Telegram WebApp 初始化时传入的数据，包含用户信息等，原始 string 类型
  // webApp?.initDataUnsafe 是 Telegram WebApp 初始化时传入的数据，包含用户信息等，解析后的对象类型
  const initTgConfig = () => {
    const app = window?.Telegram?.WebApp
    // setTgWebAppData({
    //   auth_date: 1722957370,
    //   hash: "21fac6b42723ef49458989cdd6a06e1d71c41d4420bfbaba1743f41136d8c098",
    //   user: {
    //     first_name: "Duke",
    //     id: 1894350904,
    //     last_name: "",
    //     username: "DukeYu22",
    //   }
    // })
    if (app) {
      setInitData(app.initData)
      console.log('FGA TelegramProvider app.initData:', {
        webapp: TelegramProvider,
        initDataUnsafe: app.initDataUnsafe,
        initData: app.initData,
      })
      if (app.initData?.length > 0) {
        setIsInTelegram(true)
      }
      /*if (app.initDataUnsafe?.start_param) {
        setTimeout(() => {
          processTgAppStartParam(app.initDataUnsafe.start_param)
        }, 0)
      }*/
      if (app.initDataUnsafe?.user) {
        setTimeout(() => {
          // !tgWebAppData && setTgWebAppData(app.initDataUnsafe)
          setTgWebAppData(app.initDataUnsafe)
        }, 0)
        window.localStorage('tgWebAppData', app.initDataUnsafe)
      }
      app.isVerticalSwipesEnabled = false
      app.disableVerticalSwipes()
      app.isClosingConfirmationEnabled = true
      app.enableClosingConfirmation()

      //Returns true if the user's app supports a version of the Bot API that is equal to or higher than the version passed as the parameter.
      // app.isVersionAtLeast()

      //A method that shows a native popup requesting permission for the bot to send messages to the user. If an optional callback parameter was passed, the callback function will be called when the popup is closed and the first argument will be a boolean indicating whether the user granted this access.
      // app.requestWriteAccess()

      app.ready()
      // 默认展开 Telegram WebApp
      app.expand()
      setWebApp(app)
    } else {
      console.log('FGA TelegramProvider app is null, retryCount:', retryCount)
      if (retryCount < 3) {
        setTimeout(() => {
          retryCount++
          initTgConfig()
        }, 1000)
      } else {
        // 重试 3 次后，仍然没有初始化成功，可能是 Telegram WebApp 未加载成功
        decodeTgWebAppDataFromUrl()
      }
    }
  }

  const handleUrlParamHashData = (hashData) => {
    let jsonResult = {}
    const hashParams = new URLSearchParams(decodeURIComponent(hashData))
    // 创建一个空对象用于存储转换结果
    hashParams.forEach((value, key, parent) => {
      console.log('FGA handleUrlParamHashData', { key, value, parent })
      if (key === 'tgWebAppData') {
        jsonResult = { ...jsonResult, [key]: handleUrlParamHashData(value) }
      } else {
        try {
          jsonResult = { ...jsonResult, [key]: JSON.parse(value) }
        } catch (error) {
          jsonResult = { ...jsonResult, [key]: value }
        }
      }
    })
    console.log({ hashData, jsonResult })
    return jsonResult
  }

  // 解析 tgWebAppData 中的 tgWebData
  const decodeTgWebAppDataFromUrl = () => {
    const urlString = window?.location?.href
    const splitUrl = urlString.split('#tgWebAppData=')
    console.log('FGA decodeTgWebAppDataFromUrl', { urlString, splitUrl })
    // 从 localStorage 中解析 tgWebAppData
    const decodeTgWebAppDataFromLocalStorage = () => {
      if (localStorage.getItem('tgWebAppData')) {
        console.log('getLocalStorage.tgWebAppData:\n', localStorage.getItem('tgWebAppData'))
        try {
          setTgWebAppData(localStorage.getItem('tgWebAppData'))
        } catch (error) {
          console.log('tgWebAppData parse error:', error)
        }
      }
    }
    if (splitUrl.length > 1) {
      // 处理 tgWebAppData 参数
      const tgWebAppDataObject = handleUrlParamHashData(splitUrl[1])
      if (tgWebAppDataObject) {
        console.log('decodeTgWebAppDataFromUrl tgWebAppDataObject:', tgWebAppDataObject)
        // !tgWebAppData && setTgWebAppData?.(tgWebAppDataObject)
        setTgWebAppData?.(tgWebAppDataObject)
        localStorage.setItem('tgWebAppData', tgWebAppDataObject)
      }
    } else {
      decodeTgWebAppDataFromLocalStorage()
    }
  }

  // 初始化 Telegram WebApp 的入口
  useEffect(() => {
    if (document?.readyState === 'complete' || document?.readyState === 'interactive') {
      initTgConfig()
    } else {
      window?.addEventListener('DOMContentLoaded', initTgConfig)
    }
    // 额外判断是否在 Telegram WebApp 中，有时候 Telegram WebApp 会初始化失败，但是用户已经在 Telegram WebApp 中
    if (navigator?.userAgent?.toLowerCase()?.includes('telegram') || window?.location?.search?.includes('tgWebAppStartParam')) {
      setIsInTelegram(true)
    }
    return () => {
      window?.removeEventListener('DOMContentLoaded', initTgConfig)
    }
  }, [])

/*  useEffect(() => {
    setInTgMiniApp?.(isInTelegram)
  }, [isInTelegram])*/

  useEffect(() => {
    console.log('TelegramProvider routeChange :', location);

    const updateBackButton = () => {
      if (window?.Telegram?.WebApp) {
        if (window.location.pathname === '/growth-fga/app') {
          window?.Telegram?.WebApp.BackButton?.hide();
        } else {
          const canGoBack = router?.history.length > 1; // 检查是否可以回退
          if (canGoBack) {
            window?.Telegram?.WebApp.BackButton?.onClick(() => router.goBack());
            window?.Telegram?.WebApp.BackButton?.show();
          } else {
            window?.Telegram?.WebApp.BackButton?.hide(); // 如果不能回退，隐藏后退按钮
          }
        }
      }
    };

    const timeoutId = setTimeout(updateBackButton, 500);

    return () => clearTimeout(timeoutId); // 清理定时器
  }, [location, webApp, router]);

  const value = useMemo(
    () => ({
      // webApp: webApp?.initDataUnsafe?.user ? webApp : null,
      webApp: isInTelegram ? webApp : null,
      initData,
      isInTelegram,
      user: webApp?.initDataUnsafe?.user,
    }),
    [webApp, isInTelegram, initData]
  )

  return (
    <TelegramContext.Provider value={value}>
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      {children}
    </TelegramContext.Provider>
  )
}

export const useTelegram = () => useContext(TelegramContext)
