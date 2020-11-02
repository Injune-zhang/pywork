#!/usr/bin/env python
# -*- encoding: utf-8 -*-
'''
@File    :   urls.py.py    
@Contact :   zhangyinjun1993@gmail.com


@Modify Time      @Author        @Version    @Desciption
------------      -------        --------    -----------
2020/9/13 17:37   InjuneZhang      1.0         None
'''

# import lib
from django.conf.urls import url

from App2 import views

urlpatterns = [
    url(r'^home/',views.handlehome),
    url(r'^addhumans/',views.handleaddhumans),
    url(r'^gethumans/',views.handlegethumans),
    url(r'^commit/',views.handlecommit),
]