# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import random

from django.http import HttpResponse
from django.shortcuts import render
from App2.models import human
# Create your views here.
def handlehome(request):
    return render(request,'index2.html')


def handleaddhumans(request):
    human1 = human()
    human1.h_age = 12
    human1.h_name = 'Jerry%d' % random.randrange(100)
    human1.save()
    return HttpResponse('save success! %s' % human1.h_name)

def handlegethumans(request):
    humans = human.objects.all()
    for h in humans:
        print h.h_name,',',h.h_age
    return render(request,'humanlist.html',{'h_list':humans})


def handlecommit(request):
    difficultytype = request.POST["difficulttype"]
    isbuchang = request.POST["isbuchang"]
    ylreason = request.POST["ylreason"]
    gjproject = request.POST["gjproject"]
    print "=====================",difficultytype.encode('utf-8')
    print '我的'
    print difficultytype,isbuchang,ylreason,gjproject
    return HttpResponse('''save success!  难易度：%s是否补偿：%s。
                        遗漏原因：%s。改进计划：%s''' %(difficultytype,isbuchang,ylreason,gjproject))