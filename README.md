# ttzc

## Hi Jonathan,

I modified ttzc.js so it displays differences of 2 days.

At first I just wanted to call getDay on fromDate and toDate, but that's no good since it returns a day from 0-6. I can't subtract numbers like those to get days between since if today is day 6, then tomorrow is day 0. 

So I had to do this to compare the days:

1. Make copies of the date objects
2. Remove the hour from the copies
3. Take difference of copies in milliseconds
4. With days compared, write to page

## Step 1 
I had to make a copy of the dates since I will need to modify the dates in order to compare the days between them.
```javascript
    var fromDay = new Date(fromDate.getTime());
    var toDay = new Date(toDate.getTime());
```

## Step 2
I set the copied dates to have hour zero in order to find the number of days between the dates without worrying about the differences in hours. We don't need to worry about the zero difference in minutes.
```javascript
    fromDay.setHours(0);
    toDay.setHours(0);
```

## Step 3
I subtracted the two times to get the difference in days between them.
```javascript
    var dDay = Math.round((toDay.getTime()-fromDay.getTime())/86400000);
```
On the same line where I took the difference between the days:

* I converted the millisecond difference to days.
* I rounded to assure integers for indexing.

## Step 4
I made an array with all the right phrases. I cleared the info, assuming 0 day difference.
```javascript
    var dName = ['two days behind','previous day','','next day','two days ahead'];
    fromSide.getView().clearTimeInfo();
```

If the day difference is -2, -1, 1, or 2, I updated the info with the appropriate phrase from the array.
```javascript
    if (dDay != 0 && dDay > -3 && dDay < 3){
      toSide.getView().setTimeInfo(dName[dDay+2]);
    }
```

If the day difference is 0, then the info stays cleared.
Otherwise, the number of days is labeled in your wording.
