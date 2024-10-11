package com.itheima.test02;

import java.util.ArrayList;

public class Test {
    public static void main(String[] args) {
        ArrayList<User> users = new ArrayList<>();

        //创建5个User对象并赋值
        User u1 = new User("张三",18,"男");
        User u2 = new User("李四",19,"女");
        User u3 = new User("王五",18,"女");
        User u4 = new User("赵六",20,"男");
        User u5 = new User("陈七",25,"女");

        users.add(u1);
        users.add(u2);
        users.add(u3);
        users.add(u4);
        users.add(u5);


        ArrayList<User> newUsers = getUser(users);

        for (int i = 0; i < newUsers.size(); i++) {
            User newUser = newUsers.get(i);
            System.out.println(newUser.getName() + " " + newUser.getAge() + " " + newUser.getSex());
        }


    }

    /**
     * 获得年龄大于等于18岁，并且性别为“男"的User，加入新的集合
     * @param users 原集合
     * @return 新的集合
     */
    public static ArrayList<User> getUser(ArrayList<User> users){
        ArrayList<User> newUsers = new ArrayList<>();
        for (int i = 0; i < users.size(); i++) {
            User user = users.get(i);
            if (user.getAge() >= 18 && user.getSex().equals("男")) {
                newUsers.add(user);
            }
        }

        return newUsers;
    }
}
