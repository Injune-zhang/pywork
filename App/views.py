#-- coding:UTF-8 --
from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
def mysite(request):
    return HttpResponse('第一个mysite')

def handleJisuan(request):
    return HttpResponse('处理一个jisuan')

def handletesttemp(request):
    return render(request,'index1.html')

def handlehome(request):
    return render(request,'home.html')