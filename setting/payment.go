package setting

import (
    "encoding/json"
    "strconv"
)

var PayAddress = ""
var CustomCallbackAddress = ""
var EpayId = ""
var EpayKey = ""
var Price = 7.3
var MinTopUp = 1
var USDExchangeRate = 7.3

var PayMethods = []map[string]string{
    {
        "name":  "支付宝",
        "color": "rgba(var(--semi-blue-5), 1)",
        "type":  "alipay",
        "ratio": "1",
    },
    {
        "name":  "微信",
        "color": "rgba(var(--semi-green-5), 1)",
        "type":  "wxpay",
        "ratio": "1",
    },
}

func UpdatePayMethodsByJsonString(jsonString string) error {
	PayMethods = make([]map[string]string, 0)
	return json.Unmarshal([]byte(jsonString), &PayMethods)
}

func PayMethods2JsonString() string {
	jsonBytes, err := json.Marshal(PayMethods)
	if err != nil {
		return "[]"
	}
	return string(jsonBytes)
}

func ContainsPayMethod(method string) bool {
    for _, payMethod := range PayMethods {
        if payMethod["type"] == method {
            return true
        }
    }
    return false
}

// GetPayMethodRatio returns the configured ratio for a given pay method type.
// If not set or invalid, returns 1.0.
func GetPayMethodRatio(method string) float64 {
    for _, pm := range PayMethods {
        if pm["type"] == method {
            if r, ok := pm["ratio"]; ok {
                if f, err := strconv.ParseFloat(r, 64); err == nil && f > 0 {
                    return f
                }
            }
            break
        }
    }
    return 1.0
}
