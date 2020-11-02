# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
# 主界面
def handlehome():

    return None

#登录界面
def handlelogin(request):

    return render(request,'appjisuan/index.html')


def insertname(request):
    username = '缺省用户'
    username = request.GET['username']
    print username,'=========='
    # return render(request,'appjisuan/calculator.html',locals())
    return HttpResponse(username)
    return render(request,'appjisuan/index.html')
    # return render(request,'appjisuan/calculator.html')


# def testindex(request):
#     return render(request, 'appjisuan/test1.html')
#
#
# def testadd(request):
#     a = request.GET['a']
#     b = request.GET['b']
#     print a,b
#     a = int(a)
#     b = int(b)
#     return HttpResponse(str(a + b))
#     return render(request, 'appjisuan/test1.html')
def calcu(request):
    username = request.GET['username']
    return render(request,'appjisuan/calculator.html',locals())