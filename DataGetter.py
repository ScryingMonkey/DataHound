import requests
import json
import csv

class DataGetter:


    data = []
    dataKeys = []

    def __init__(self):
        pass

    def apiBitcoinAverageData(self,symbol,period,dataFormat):
        # Symbols:
        #   BTCUSD : Bitcoin in USD
        # Periods:
        #   daily - per minute daily sliding window.
        #   monthly - per hour monthly sliding window.
        #   alltime - per day all time history (default value)
        # dataFormat:
        #   json
        #   csv
        
        lods = []
        url = "https://apiv2.bitcoinaverage.com/indices/global/history/%s" % symbol
        querystring = {"period":period,"format":dataFormat}

        headers = {
            'cache-control': "no-cache",
            'postman-token': "93824daf-ae3e-58cb-eaf7-02f938a2d6b3"
            }

        response = requests.request("GET", url, headers=headers, params=querystring)
        parsed_json = json.loads(response.text)
        print '>> Retrieved %s rows and stored in data' % len(parsed_json)
        for e in parsed_json:
            lods.append(e)
        self.data = lods
        for e in lods[0].keys():
            self.dataKeys.append(str(e))
        print '>> dataKeys: ',self.dataKeys
        return response

    def writeToCsv(self,path, delimiter=','):
        data = self.data
        fieldnames = self.dataKeys
        print fieldnames
        with open(path, "wb") as out_file:
            writer = csv.DictWriter(out_file, delimiter=delimiter, fieldnames=fieldnames)
            writer.writeheader()
            for row in data:
                writer.writerow(row)
        print '>> Wrote %s rows to "%s"' % (len(self.data), path)
        return True
        
    def head(self,n=5):
        for i in range(n):
            print self.data[i]
        return self.data[:n]
    

dg = DataGetter()
dg.apiBitcoinAverageData("BTCUSD","alltime","json")
#print dg.head()
print dg.data[0]
print dg.data[-1]
dg.writeToCsv(".\BTCPriceData.csv")
