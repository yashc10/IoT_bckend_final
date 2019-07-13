import sys, json, numpy as np
from dateutil import parser
from datetime import datetime

#Read data from stdin
def read_in():
    sensordata = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(sensordata[0])

def main():
    #get our data as an array from read_in()
    data = read_in()
    print (len(data))
    start_time = parser.parse(data[1][0:-1])
    print(str(start_time)[0:-6])
    end_time = parser.parse(data[2][0:-1])
    print(start_time)
    delta = (datetime(end_time.year, end_time.month,
    end_time.day, end_time.hour) - datetime(start_time.year, start_time.month,
    start_time.day,start_time.hour))
    print(delta)
#    freq = data[0]
    freq="hourly"
    annual_data = data[3]
    monthly_data = data[4]
    daily_data = data[5]
    hourly_data = data[6]
    attribute = 'humidity'
    finaldata = []
    finallabels = []
    
    print(len(annual_data))
    print(len(monthly_data))
    print(len(daily_data))
    print(len(hourly_data))
    
    if freq=='hourly':
        no_hours=delta.days*24 + delta.seconds//3600 + 1;
        finaldata = [[] for i in range (no_hours)]
        finallabels = [None for i in range(no_hours)]
        print (len(finaldata))
        for year in annual_data:
            for month in year['monthArray']:
                for day in month['dayArray']:
                    for hour in day['hourArray']:
#                        print ("hi")
#                        print (day['date'])
#                        diff = datetime((year['year']+1900), 6, day['date'], hour['hour'])
#                        print(diff)
                        s_time= datetime(start_time.year, start_time.month, 
                                 start_time.day, start_time.hour)
#                        print(diff-b)
#                        
#                        print(index)
                        for reading in hour['readingArray']:
                            print ("hello")
                            read_time = parser.parse(reading['timeStamp'][0:-1])
                            diff = datetime(read_time.year, read_time.month,
                                    read_time.day, read_time.hour)-s_time;
                            index=diff.days*24 + diff.seconds//3600;
                            label=(str(read_time)[0:-9] + ","+
                                   str(read_time)[-9:-6]+"th Hour")
#                            print("Index is: "),
#                            print(index)
                            if index in range(0, no_hours):
#                                print(reading)
                                finaldata[index].append(reading[attribute])
                                finallabels[index]=label
#        print(finaldata)
        for month in monthly_data:
            print(month)
            for day in month['dayArray']:
                print(day)
                for hour in day['hourArray']:
                    s_time = datetime(start_time.year, start_time.month, 
                             start_time.day, start_time.hour)
                    for reading in hour['readingArray']:
                        read_time = parser.parse(reading['timeStamp'][0:-1])
                        diff = datetime(read_time.year, read_time.month,
                                read_time.day, read_time.hour)-s_time;
                        index=diff.days*24 + diff.seconds//3600;
                        label=(str(read_time)[0:-9] + ","+
                               str(read_time)[-9:-6]+"th Hour")
#                            print("Index is: "),
#                            print(index)
                        if index in range(0, no_hours):
#                                print(reading)
                            finaldata[index].append(reading[attribute])
                            finallabels[index]=label
#        print("oops month is empty")
        for day in daily_data:
            for hour in day['hourArray']:
    #            print (hour)
                s_time = datetime(start_time.year, start_time.month, 
                         start_time.day, start_time.hour)
                for reading in hour['readingArray']:
#                    print ("hello")
                    read_time = parser.parse(reading['timeStamp'][0:-1])
                    diff = datetime(read_time.year, read_time.month,
                                    read_time.day, read_time.hour)-s_time;
                    index=diff.days*24 + diff.seconds//3600;
                    label=(str(read_time)[0:-9] + ","+
                    str(read_time)[-9:-6]+"th Hour")
#                    print ("label is ",label)
                    if index in range(0, no_hours):
#                                print(reading)
                        finaldata[index].append(reading[attribute])
                        finallabels[index]=label
        for hour in hourly_data:
            s_time = datetime(start_time.year, start_time.month, 
                     start_time.day, start_time.hour)
            for reading in hour['readingArray']:
                read_time = parser.parse(reading['timeStamp'][0:-1])
                diff = datetime(read_time.year, read_time.month,
                            read_time.day, read_time.hour)-s_time;
                index=diff.days*24 + diff.seconds//3600;
                label=(str(read_time)[0:-9] + ","+
                    str(read_time)[-9:-6]+"th Hour")
                print ("label is ",label)
                if index in range(0, no_hours):
#                                print(reading)
                    finaldata[index].append(reading[attribute])
                    finallabels[index]=label
    #            temp=j['timeStamp']
    #            finallabels.append(temp.getDate()+"-"+(temp.getMonth()+1)+"-"
    #           +temp.getFullYear()
    #            +", Hour "+temp.getHours())
        for i in range (0, no_hours):
            if (finallabels[i]!=None):
                print (finallabels[i],":",finaldata[i])
                print("Mean:",np.array(finaldata[i]).mean())
    #    print(np.array(finaldata).mean())
        print(type(data))

#start process
if __name__ == '__main__':
    main()
